exports.seed = async function (knex) {
    // Очищаем таблицу и сбрасываем автоинкремент
    await knex.raw('TRUNCATE TABLE orders RESTART IDENTITY CASCADE');

    // Вставка тестовых заказов
    await knex('orders').insert([
        { user_id: 1, total_amount: 100.50, status: 'new' },
        { user_id: 2, total_amount: 200.75, status: 'paid' },
        { user_id: 3, total_amount: 300.00, status: 'shipped' }
    ]);
};