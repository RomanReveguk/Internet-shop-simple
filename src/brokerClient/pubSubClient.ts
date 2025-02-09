import { PubSub } from '@google-cloud/pubsub';
import * as path from 'path';

const pubSubClient = new PubSub({
    keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS || '')
});

export const publishMessage = async (topicName: string, message: string): Promise<void> => {
    const dataBuffer = Buffer.from(JSON.stringify(message));

    try {
        await pubSubClient.topic(topicName).publish(dataBuffer);
        console.log(`Message published: ${JSON.stringify(message)}`);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
};
