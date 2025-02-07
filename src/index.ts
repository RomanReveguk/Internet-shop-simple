/*
import express from "express";
import { db } from "./config/database";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
    const result = await db.raw("SELECT 1+1 AS result");
    res.json({ message: "Server is running!", dbCheck: result.rows[0] });
});

app.listen(3000, () => console.log("Server running on port 3000"));
*/

import express from 'express';
import { db } from './config/database'; // База данных
import { userRoutes } from './routes/userRoutes'; // Роуты для пользователей
//import { orderRoutes } from './routes/orderRoutes'; // Роуты для заказов
import { errorHandler } from './middlewares/errorHandler'; // Мидлвар для обработки ошибок
import { notFoundHandler } from './middlewares/notFoundHandler'; // Мидлвар для обработки несуществующих маршрутов

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
//app.use('/api/orders', orderRoutes);  // Все роуты для заказов

// Мидлвар для обработки несуществующих маршрутов
app.use(notFoundHandler);

// Ошибки
app.use(errorHandler);

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
