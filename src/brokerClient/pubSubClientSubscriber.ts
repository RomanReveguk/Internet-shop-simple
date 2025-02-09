import {Message, PubSub} from '@google-cloud/pubsub';
import {db} from '../config/database';
import path from "path";

// Инициализируем PubSub клиент с ключом
const pubSubClient = new PubSub({
    keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS || '')
});

const subscriptionName = 'my-topic-sub';
const subscription = pubSubClient.subscription(subscriptionName);

// Обработка полученного сообщения
const processMessage = async (message: Message): Promise<void> => {
    const trx = await db.transaction();  // Начинаем транзакцию
    const messageId: string = message.id;

    try {
        // Проверяем, было ли обработано это сообщение
        const existingMessage = await trx('processed_messages')
            .where('message_id', messageId)
            .first();

        if (existingMessage) {
            console.log('Message already processed:', messageId);
            message.ack();  // Подтверждаем получение
            await trx.commit();  // Завершаем транзакцию
            return;
        }

        const messageData = message.data.toString();
        console.log('Message data as string:', messageData);

        const parsedMessage = JSON.parse(messageData);
        const user = typeof parsedMessage === 'object' ? parsedMessage : JSON.parse(parsedMessage);

        // Проводим проверку структуры объекта
        if (!user || !user.name || !user.email) {
            console.error('Invalid message format:', user);
            message.nack(); // Отклоняем сообщение
            await trx.rollback();  // Отменяем транзакцию
            return;
        }

        // Проверяем, существует ли пользователь с таким email
        const existingUser = await trx('users').where('email', user.email).first();

        if (existingUser) {
            console.log('User already exists:', user.email);
            message.ack(); // Подтверждаем, что сообщение обработано
            await trx.commit();
            return;
        }

        // Сохраняем пользователя в базу
        await trx('users').insert(user);

        // Записываем ID сообщения в базу
        await trx('processed_messages').insert({ message_id: messageId });

        console.log('User created:', user);
        message.ack(); // Подтверждаем, что сообщение обработано
        await trx.commit();  // Завершаем транзакцию

    } catch (error) {
        console.error('Error processing message:', error);
        await trx.rollback();  // Откатываем транзакцию в случае ошибки
        message.nack(); // Отклоняем сообщение
    }
};

// Функция для получения сообщений с сервера
export async function listenForMessages() {
    subscription.on('message', async (message: Message) => {
        try {
            await processMessage(message);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    console.log('Started listening for messages...');
}
