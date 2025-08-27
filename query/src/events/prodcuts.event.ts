import prisma from '@/config/db';

export class productEvent {

    async createProduct(data: any) {
        const product = await prisma.product.create({
            data: {
                id: data.id,
                name: data.name,
                price: data.price,
                description: data.description
            }
        });
        return product;
    }
    async updateProduct(data: any) {
        const product = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,
                price: data.price,
                description: data.description
            }
        });
        return product;
    }
}

export const ProductEvent = new productEvent();
