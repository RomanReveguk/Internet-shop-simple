import request from 'supertest';
import app from '../../index';
import { db } from '../../config/database';
import fs from 'fs';
import path from 'path';

describe('User API', () => {
    let userId: number;

    beforeAll(async () => {
        await db('users').del(); // Очищаем таблицу перед тестами

        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            });

        userId = response.body.id; // Сохраняем ID тестового пользователя
    });

    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Jane Doe');
    });

    it('should return a user by ID', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
    });

    it('should return 404 for non-existing user', async () => {
        const response = await request(app).get('/api/users/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should update a user', async () => {
        const response = await request(app)
            .put(`/api/users/${userId}`)
            .send({
                name: 'Updated User',
                email: 'updated@example.com',
                password: 'newpassword123'
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated User');
        expect(response.body.email).toBe('updated@example.com');
    });

    it('should return a paginated list of users', async () => {
        await request(app).post('/api/users').send({ name: 'Alice', email: 'alice@example.com', password: '12345' });
        await request(app).post('/api/users').send({ name: 'Bob', email: 'bob@example.com', password: '12345' });

        const response = await request(app)
            .post('/api/users/_list')
            .send({ page: 1, size: 2 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('list');
        expect(response.body.list.total).toBeGreaterThan(0);
    });

    it('should return a user with orders', async () => {
        // Добавляем тестовый заказ
        const order = await db('orders').insert({
            user_id: userId,
            total_amount: 100.50,
            status: 'pending'
        }).returning('*');

        const response = await request(app).get(`/api/users/${userId}/orders`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('orders');
        expect(response.body.orders.length).toBeGreaterThan(0);
        expect(parseFloat(response.body.orders[0].total_amount).toFixed(2)).toBe('100.50');
    });

    it('should delete a user', async () => {
        const response = await request(app).delete(`/api/users/${userId}`);

        expect(response.status).toBe(204);

        // Проверяем, что пользователя больше нет
        const checkResponse = await request(app).get(`/api/users/${userId}`);
        expect(checkResponse.status).toBe(404);
    });

    it('should upload users from a JSON file', async () => {
        const usersData = [
            { name: 'User1', email: 'user1@example.com', password: 'pass1' },
            { name: 'User2', email: 'user2@example.com', password: 'pass2' }
        ];

        const filePath = path.join(__dirname, 'test_users.json');
        fs.writeFileSync(filePath, JSON.stringify(usersData));

        const response = await request(app)
            .post('/api/users/upload')
            .attach('file', filePath);

        expect(response.status).toBe(200);
        expect(response.body.successCount).toBe(usersData.length);

        // Удаляем временный файл
        fs.unlinkSync(filePath);
    });

    it('should return top N users by order count', async () => {
        const response = await request(app).get('/api/users/top').query({ n: 5 });

        expect(response.status).toBe(200);
        expect(response.body.length).toBeLessThanOrEqual(5);
    });

    afterAll(async () => {
        await db.destroy(); // Закрываем соединение с БД после тестов
    });
});
