import prisma from '@/config/db';
import { sendMessage } from '@/kafka/producer';
import { Router } from 'express';

const router = Router();

// create the product
router.post("/", (req, res) => {
    let { name, description, price } = req.body;
    if (!name || !price) {
        name = 'Unnamed Product';
        price = 0;
    }
    prisma.product.create({
        data: { name, description, price }
    }).then(product => {
        sendMessage('PRODUCT-CREATED', [{ key: product.id, value: JSON.stringify(product) }])
        res.status(201).json(product);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error creating product");
    });
});

// update the product
router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    prisma.product.update({
        where: { id },
        data: { name, description, price }
    }).then(product => {
        sendMessage('PRODUCT-UPDATED', [{ key: product.id, value: JSON.stringify(product) }])
        res.json(product);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error updating product");
    });
});



export { router as productRouter };
