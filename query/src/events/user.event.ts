import prisma from '@/config/db';

export class userEvent {

    async createUser(data: any) {
        const user = await prisma.user.create({
            data: {
                id: data.id,
                email: data.email,
                name: data.name,
                password: data.password
            }
        });
        return user;
    }
    async updateUser(data: any) {
        const user = await prisma.user.update({
            where: { id: data.id },
            data: {
                email: data.email,
                name: data.name,
                password: data.password
            }
        });
        return user;
    }


}

export const UserEvent = new userEvent();
