import knex from "knex";
import dotenv from "dotenv";

// Загружаем переменные окружения
dotenv.config();

// Проверяем, правильно ли загружаются переменные
console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);


export const db = knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8',
    },
});