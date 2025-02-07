import request from 'supertest';
import app from '../../index';
import { db } from '../../config/database';

describe('Order API', () => {
    let userId: number;
    let orderId: number;

    beforeAll(async () => {
        await db.raw('TRUNCATE TABLE orders RESTART IDENTITY CASCADE'); // Чистим заказы перед тестами
        await db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE'); // Чистим пользователей перед тестами

        // Создаём пользователя
        const userResponse = await request(app)
            .post('/api/users')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        userId = userResponse.body.id;

        // Создаём заказ
        const orderResponse = await request(app)
            .post('/api/orders')
            .send({
                user_id: userId,
                total_amount: 100.50,
                status: 'pending',
            });

        orderId = orderResponse.body.id;
    });

    it('should get all orders for a user', async () => {
        const response = await request(app).get(`/api/orders/user/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get(`/api/orders/${orderId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', orderId);
    });

    it('should update an order', async () => {
        const response = await request(app)
            .put(`/api/orders/${orderId}`)
            .send({
                total_amount: 150.00,
                status: 'completed',
            });

        expect(response.status).toBe(200);
        expect(parseFloat(response.body.total_amount).toFixed(2)).toBe('150.00');
        expect(response.body.status).toBe('completed');
    });

    it('should delete an order', async () => {
        const response = await request(app).delete(`/api/orders/${orderId}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/api/orders/999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Order not found');
    });

    afterAll(async () => {
        await db.destroy(); // Закрываем соединение с БД после тестов
    });
});
