exports.up = function (knex) {
    return knex.schema.createTable("orders", (table) => {
        table.increments("id").primary(); // ID заказа
        table.integer("user_id")
            .unsigned().references("id")
            .inTable("users")
            .onDelete("CASCADE"); // Связь с пользователем
        table.decimal("total_amount", 10, 2).notNullable(); // Общая сумма заказа
        table.string("status").notNullable(); // Статус заказа (например, "новый", "оплачен", "отправлен")
        table.timestamps(true, true); // Время создания и обновления
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("orders");
};