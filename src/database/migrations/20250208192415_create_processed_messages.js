exports.up = function (knex) {
    return knex.schema.createTable('processed_messages', (table) => {
        table.increments('id').primary();  // ID записи
        table.string('message_id').unique().notNullable();  // ID сообщения, которое уже обработано
        table.timestamps(true, true);  // Время обработки сообщения
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('processed_messages');
};