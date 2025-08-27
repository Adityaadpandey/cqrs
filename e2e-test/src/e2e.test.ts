import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const GATEWAY_URL = 'http://localhost:3123';
const QUERY_URL = 'http://localhost:3123';

const NUM_RECORDS = 300000; // 300k records 1.8 million in 500 sec

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('E2E CQRS System Test', () => {
    let userIds: string[] = [];
    let productIds: string[] = [];
    let orderIds: string[] = [];

    jest.setTimeout(300000); // 5 minutes for large-scale test

    it('should create users (with delay)', async () => {
        const createUser = async () => {
            const id = uuidv4();
            await delay(Math.random() * 50); // random delay between 0–50ms

            const res = await axios.post(`${GATEWAY_URL}/user`, {
                id,
                email: `${id}@test.com`,
                password: 'password123',
                name: `User-${id}`
            });
            userIds.push(res.data.id);
        };

        await Promise.all([...Array(NUM_RECORDS)].map(createUser));
    });

    it('should create products (with delay)', async () => {
        const createProduct = async () => {
            await delay(Math.random() * 50); // random delay between 0–50ms

            const res = await axios.post(`${GATEWAY_URL}/product`, {
                name: `Product-${uuidv4()}`,
                description: `Description for product ${uuidv4()}`,
                price: Math.floor(Math.random() * 100)
            });
            productIds.push(res.data.id);
        };

        await Promise.all([...Array(NUM_RECORDS)].map(createProduct));
    });

    it('should create orders (serial with longer delay)', async () => {
        const createOrder = async () => {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const items = [0, 1, 2].map(() => ({
                productId: productIds[Math.floor(Math.random() * productIds.length)],
                quantity: Math.floor(Math.random() * 5) + 1
            }));

            const totalPrice = items.reduce((sum, item) => {
                return sum + (item.quantity * 10); // mock price
            }, 0);

            await delay(Math.random() * 150); // 0–150ms delay

            const res = await axios.post(`${GATEWAY_URL}/order`, {
                userId,
                items,
                price: totalPrice,
            });

            orderIds.push(res.data.id);
        };

        for (let i = 0; i < NUM_RECORDS; i++) {
            await createOrder();
        }
    });

    it('should verify users via Query service (slight delay)', async () => {
        for (const id of userIds.slice(0, 100)) {
            await delay(20); // 20ms between checks
            const res = await axios.get(`${QUERY_URL}/user/${id}`);
            expect(res.status).toBe(201);
            expect(res.data.email).toContain('@test.com');
        }
    });

    it('should verify products via Query service (slight delay)', async () => {
        for (const id of productIds.slice(0, 100)) {
            await delay(20);
            const res = await axios.get(`${QUERY_URL}/product/${id}`);
            expect(res.status).toBe(200);
            expect(res.data.name).toContain('Product');
        }
    });

    it('should verify orders via Query service (slight delay)', async () => {
        for (const id of orderIds.slice(0, 100)) {
            await delay(30);
            const res = await axios.get(`${QUERY_URL}/order/${id}`);
            expect(res.status).toBe(200);
            expect(res.data.user).toBeDefined();
            expect(res.data.orderItems.length).toBeGreaterThan(0);
            expect(res.data.orderItems[0].product).toBeDefined();
        }
    });
});
