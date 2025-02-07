exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary(); // ID пользователя
        table.string("name").notNullable(); // Имя пользователя
        table.string("email").unique().notNullable(); // Уникальный email
        table.string("password").notNullable(); // Пароль
        table.timestamps(true, true); // Время создания и обновления
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};