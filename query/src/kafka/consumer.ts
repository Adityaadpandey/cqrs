import prisma from '@/config/db';
import { consumer } from '.';
import { OrderEvent } from '../events/order.event';
import { ProductEvent } from '../events/prodcuts.event';

import { UserEvent } from '../events/user.event';


export let lastProcessedTimestamp: string | null = null;

export const startEventConsumer = async () => {
    await consumer.connect()
    const topics = [
        'USER-CREATED',
        'USER-UPDATED',
        'PRODUCT-CREATED',
        'PRODUCT-UPDATED',
        'ORDER-CREATED'
    ];

    for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
        eachMessage: async (messagePayload) => {
            const { topic, partition, message } = messagePayload;
            const value = message.value?.toString();
            console.log(`Received message: ${value} on topic: ${topic}, partition: ${partition}`);

            if (!value) return;
            const parsedValue = JSON.parse(value);
            // console.log('Parsed Value:', parsedValue);


            const { traceId, timestamp, type } = parsedValue;
            if (!traceId) {
                console.warn("Missing traceId. Skipping for safety.");
                return;
            }
            // Check if event was already processed
            const alreadyProcessed = await prisma.processedEvent.findUnique({
                where: { eventId: traceId },
            });

            if (alreadyProcessed) {
                console.log(`Duplicate event skipped: ${traceId}`);
                return;
            }
            const data = typeof parsedValue.data === 'string'
                ? JSON.parse(parsedValue.data)
                : parsedValue.data;



            // Process the message based on its type
            switch (type) {
                case 'USER-CREATED':
                    // Handle user creation logic
                    // console.log('User Created:', data);
                    await UserEvent.createUser(data);
                    break;
                case 'USER-UPDATED':
                    // Handle user update logic
                    // console.log('User Updated:', data);
                    await UserEvent.updateUser(data);
                    break;
                case 'PRODUCT-CREATED':
                    // Handle product creation logic
                    // console.log('Product Created:', data);
                    await ProductEvent.createProduct(data);

                    break;
                case 'PRODUCT-UPDATED':
                    // Handle product update logic
                    // console.log('Product Updated:', data);
                    await ProductEvent.updateProduct(data);
                    break;
                case 'ORDER-CREATED':
                    // Handle order creation logic
                    // console.log('Order Created:', data);
                    await OrderEvent.createOrder(data);
                    break;
                default:
                    console.warn('Unknown message type:', parsedValue.type);

            }
            await prisma.processedEvent.create({
                data: { eventId: traceId },
            });
            lastProcessedTimestamp = timestamp;
        }
    })
}

export async function stopEventConsumer() {
    if (consumer) {
        await consumer.disconnect();
    }
}
