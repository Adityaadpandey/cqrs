import prisma from '@/config/db';
import { Router } from 'express';

const router = Router();



// update user
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.order.findUnique({
        where: { id },
        include: {
            user: true, orderItems: {
                include: {
                    product: true
                },
            }
        }
    }).then(user => {
        res.json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error updating user");
    }
    );
});



export { router as orderRouter };
