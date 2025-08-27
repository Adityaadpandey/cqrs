import prisma from '@/config/db';
import { sendMessage } from '@/kafka/producer';
import { Router } from 'express';

const router = Router();

// creation of user
router.post("/", (req, res) => {
    // Logic to create a user
    const { email, name, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }
    prisma.user.create({
        data: { email, name, password }
    }).then(user => {
        sendMessage('USER-CREATED', [{ key: user.id, value: JSON.stringify(user) }])
        res.status(201).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error creating user");
    });
});


// update user
router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const { email, name, password } = req.body;
    prisma.user.update({
        where: { id },
        data: { email, name, password }
    }).then(user => {
        sendMessage('USER-UPDATED', [{ key: user.id, value: JSON.stringify(user) }])
        res.json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error updating user");
    }
    );
});



export { router as userRouter };
