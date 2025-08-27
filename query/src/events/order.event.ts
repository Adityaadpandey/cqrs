import prisma from '@/config/db';

export class orderEvent {
    async createOrder(data: any) {
        const order = await prisma.order.create({
            data: {
                id: data.id,
                price: data.price,
                user: {
                    connect: { id: data.userId }
                },
                orderItems: {
                    create: data.items.map((item: { productId: string; quantity: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                }
            }
        });
        return order;
    }
}

export const OrderEvent = new orderEvent();
