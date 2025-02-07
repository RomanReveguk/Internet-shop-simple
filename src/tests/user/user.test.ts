import request from 'supertest';
import app from '../../index';
import { db } from '../../config/database';

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

    afterAll(async () => {
        await db.destroy(); // Закрываем соединение с БД после тестов
    });
});
