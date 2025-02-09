import {PubSub} from '@google-cloud/pubsub';
import {db} from '../../config/database';
import * as path from 'path';
import {promisify} from 'util';
import {listenForMessages} from '../../brokerClient/pubSubClientSubscriber';

const pubSubClient = new PubSub({
    keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS || '')
});

const topicName = 'my-topic';
const subscriptionName = 'my-topic-sub';

const testMessage = {
    name: 'Roman Test',
    email: 'RomanTest@example.com',
    password: 'password1235'
};

const waitForMessageProcessing = promisify(setTimeout);

// Функция для публикации сообщения
const publishTestMessage = async () => {
    const dataBuffer = Buffer.from(JSON.stringify(testMessage));
    await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log('Test message published.');
};

// Очистка базы данных перед каждым тестом
const clearDatabase = async () => {
    await db('users').del();
    await db('processed_messages').del();
};

describe('Integration Test for Pub/Sub Message Handling', () => {
    beforeAll(async () => {
        // Подключаемся к базе данных и очищаем таблицы перед тестом
        await clearDatabase();
    });

    it('should process and insert message from Pub/Sub into the database', async () => {
        // Настроим промис для теста
        const waitForProcessing = promisify(setTimeout);

        // Запустим подписку на сообщения
        listenForMessages();

        // Публикуем тестовое сообщение
        await publishTestMessage();

        // Даем время для того, чтобы сообщение было обработано
        await waitForProcessing(3000); // Подождем 3 секунды

        // Проверим, что пользователь добавлен в базу данных
        const userInDb = await db('users').where('email', testMessage.email).first();

        expect(userInDb).not.toBeNull();
        expect(userInDb.name).toBe(testMessage.name);
        expect(userInDb.email).toBe(testMessage.email);

        // Также проверим, что ID сообщения сохранено в таблице processed_messages
        const processedMessage = await db('processed_messages')
            .where('message_id', expect.any(String))
            .first();

        expect(processedMessage).not.toBeNull();
    });

    afterAll(async () => {
        // Очистим базу данных после тестов
        await clearDatabase();
    });
});