// специальный скрипт для выполнения миграций через команду Knex CLI.
const knex = require("knex");
const knexfile = require("./knexfile");
const db = knex(knexfile.development);

db.migrate
    .latest()
    .then(() => {
        console.log("Migrations completed!");
        process.exit(0); // Завершаем процесс успешно
    })
    .catch((err) => {
        console.error("Error running migrations:", err);
        process.exit(1); // Завершаем процесс с ошибкой
    });