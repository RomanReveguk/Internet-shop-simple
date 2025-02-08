exports.seed = async function (knex) {
    // Очищаем таблицу и сбрасываем автоинкремент
    await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

    // Вставка тестовых пользователей
    await knex('users').insert([
        { name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
        { name: 'Mike Johnson', email: 'mike@example.com', password: 'password789' },
    ]);
};