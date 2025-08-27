import prisma from '@/config/db';
import { sendMessage } from '@/kafka/producer';
import { Router } from 'express';

const router = Router();

// create the order with the order items
router.post("/", async (req, res) => {
    const { userId, items, price } = req.body;
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send("userId and items are required");
    }
    try {
        const order = await prisma.order.create({
            data: {
                price: price || 0,
                user: {
                    connect: { id: userId }
                },
                orderItems: {
                    create: items.map((item: { productId: string; quantity: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                }
            },
            include: { orderItems: true }
        });
        sendMessage('ORDER-CREATED', [{ key: order.id, value: JSON.stringify(order) }])
        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating order");
    }
});



export { router as orderRouter };
