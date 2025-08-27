import prisma from '@/config/db';
import { Router } from 'express';

const router = Router();

router.get("/", async (req, res) => {
    await prisma.product.findMany().then(products => {
        res.json(products);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error fetching products");
    });
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.product.findUnique({
        where: { id },
    }).then(user => {
        res.json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error updating user");
    }
    );
});



export { router as productRouter };
