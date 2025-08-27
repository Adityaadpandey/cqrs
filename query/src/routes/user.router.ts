import prisma from '@/config/db';
import { Router } from 'express';

const router = Router();

// creation of user
router.get("/:id", async (req, res) => {
    // Logic to create a user
    const { id } = req.params;

    await prisma.user.findUnique({
        where: { id }
    }).then(user => {
        res.status(201).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error creating user");
    });
});




export { router as userRouter };
