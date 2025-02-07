import express from 'express';
import { db } from './config/database'; // База данных
import Knex from 'knex';
import { Model } from 'objection';
import { userRoutes } from './routes/userRoutes'; // Роуты для пользователей
import { orderRoutes } from './routes/orderRoutes'; // Импортируем маршруты для заказов
import { errorHandler } from './middlewares/errorHandler'; // Мидлвар для обработки ошибок
import { notFoundHandler } from './middlewares/notFoundHandler'; // Мидлвар для обработки несуществующих маршрутов

// Инициализируем Knex
const knex = Knex({
    client: 'pg', // Указываем клиент для PostgreSQL
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
});

// Передаем Knex в Objection.js
Model.knex(knex);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Вспомогательная функция для обработки ошибок
const handleError = (error: unknown): string =>
    error instanceof Error ? error.message : 'Unknown error';

// Проверка статуса сервера и БД
app.get('/', async (req, res) => {
    try {
        const result = await db.raw('SELECT 1+1 AS result');
        res.json({ message: 'Server is running!', dbCheck: result.rows[0] });
    } catch (error: unknown) {
        res.status(500).json({ message: 'Database connection failed', error: handleError(error) });
    }
});

// Роуты
app.use('/api/users', userRoutes);  // Все роуты для пользователей
app.use('/api/orders', orderRoutes); // Подключаем маршруты для заказов

// Мидлвар для обработки несуществующих маршрутов
app.use(notFoundHandler);

// Ошибки
app.use(errorHandler);

// Запуск сервера **только если файл запущен напрямую**
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;