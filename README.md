My first simple project.

Need add .env file with
DB_HOST=localhost
DB_PORT=5433 
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=romandb


применяет миграцию для БД 
knex migrate:latest



Пояснение:
createOrder — создает новый заказ и возвращает его в ответе.
getOrdersByUserId — получает все заказы пользователя по его userId.
getOrderById — получает заказ по его уникальному ID.
updateOrder — обновляет данные заказа, такие как общая сумма или статус.
deleteOrder — удаляет заказ по его ID.
Маршруты в orderRoutes обеспечивают обработку всех этих действий через HTTP-запросы.

Пример работы с запросами
POST /api/orders/ — создание заказа:
Тело запроса:
{
"user_id": 1,
"total_amount": 100.50,
"status": "new"
}

GET /api/orders/user/1 — получение всех заказов пользователя с ID 1.

GET /api/orders/1 — получение заказа с ID 1.

PUT /api/orders/1 — обновление заказа с ID 1:
Тело запроса:
{
"total_amount": 150.00,
"status": "paid"
}

DELETE /api/orders/1 — удаление заказа с ID 1.



Запуск тестов:
Вы можете запустить тесты с помощью команды:
npm run test