import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'fs';
import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import type * as DatabaseModule from '../../src/api/database';

// By default a throwaway MySQL container is started with Testcontainers (requires Docker).
// Set USE_LOCAL_MYSQL=1 to use an existing server instead (settings from .env / DB_* variables);
// a throwaway schema is created on it and dropped afterwards.
const useLocalMysql = process.env.USE_LOCAL_MYSQL === '1';

if (useLocalMysql && existsSync('.env')) {
    process.loadEnvFile('.env');
}

const TEST_DB_PREFIX = 'awesome_pizza_test_';
const TEST_DB_NAME = `${TEST_DB_PREFIX}${process.pid}_${Date.now()}`;

describe('database layer (MySQL)', () => {
    let db: typeof DatabaseModule;
    let admin: Connection;
    let container: StartedMySqlContainer | undefined;

    const query = async (sql: string, params: unknown[] = []) => {
        const [rows] = await admin.query<RowDataPacket[]>(sql, params);
        return rows;
    };

    beforeAll(async () => {
        if (!useLocalMysql) {
            container = await new MySqlContainer('mysql:8.4').start();
            process.env.DB_HOST = container.getHost();
            process.env.DB_PORT = String(container.getPort());
            process.env.DB_USER = 'root';
            process.env.DB_PASSWORD = container.getRootPassword();
        }

        const connectionOptions = {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        };

        try {
            admin = await mysql.createConnection(connectionOptions);
        } catch (error) {
            throw new Error(
                `Cannot connect to MySQL at ${connectionOptions.host}:${connectionOptions.port} ` +
                `(set DB_HOST/DB_PORT/DB_USER/DB_PASSWORD): ${(error as Error).message}`
            );
        }

        // database.ts reads its settings at import time, so set them before importing
        process.env.DB_NAME = TEST_DB_NAME;
        db = await import('../../src/api/database');
        await db.initDatabase();
        await admin.changeUser({ database: TEST_DB_NAME });
    }, 180_000);

    afterAll(async () => {
        await db?.closeDatabase();
        if (admin) {
            if (useLocalMysql && TEST_DB_NAME.startsWith(TEST_DB_PREFIX)) {
                await admin.query(`DROP DATABASE IF EXISTS \`${TEST_DB_NAME}\``);
            }
            await admin.end();
        }
        await container?.stop();
    }, 60_000);

    describe('initDatabase', () => {
        it('creates the schema', async () => {
            const tables = await query(
                'SELECT table_name AS name FROM information_schema.tables WHERE table_schema = ?',
                [TEST_DB_NAME]
            );

            expect(tables.map(t => t.name).sort()).toEqual(['menu_entries', 'order_items', 'orders']);
        });

        it('seeds the menu and orders', async () => {
            expect(await db.getDailyMenu()).toHaveLength(5);
            expect((await db.getOrders()).map(o => o.id)).toEqual(
                expect.arrayContaining(['order-001', 'order-002', 'order-003'])
            );
        });

        it('is idempotent and does not duplicate seed data', async () => {
            const menuBefore = await db.getDailyMenu();
            const ordersBefore = await db.getOrders();

            await db.initDatabase();

            expect(await db.getDailyMenu()).toEqual(menuBefore);
            expect(await db.getOrders()).toEqual(ordersBefore);
        });
    });

    describe('getDailyMenu', () => {
        it('maps image_url to imageUrl', async () => {
            const [first] = await db.getDailyMenu();

            expect(first).toEqual({
                name: 'Margherita Pizza',
                description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil',
                imageUrl: 'assets/origs/margherita.png'
            });
            expect(Object.keys(first)).not.toContain('image_url');
        });
    });

    describe('getOrders / findOrderById', () => {
        it('returns seeded orders with their items in insertion order', async () => {
            const orders = await db.getOrders();

            expect(orders.slice(0, 3)).toEqual([
                {
                    id: 'order-001',
                    sender: 'John Doe',
                    status: 'RECEIVED',
                    contents: [
                        { name: 'Margherita Pizza', quantity: 2 },
                        { name: 'Pepperoni Pizza', quantity: 1 }
                    ]
                },
                {
                    id: 'order-002',
                    sender: 'Jane Smith',
                    status: 'DELIVERING',
                    contents: [
                        { name: 'Vegetarian Delight', quantity: 1 },
                        { name: 'BBQ Chicken Pizza', quantity: 1 }
                    ]
                },
                {
                    id: 'order-003',
                    sender: 'Mike Johnson',
                    status: 'DELIVERED',
                    contents: [{ name: 'Quattro Stagioni', quantity: 3 }]
                }
            ]);
        });

        it('finds an order by id', async () => {
            const found = await db.findOrderById('order-003');

            expect(found?.sender).toBe('Mike Johnson');
            expect(found?.contents).toEqual([{ name: 'Quattro Stagioni', quantity: 3 }]);
        });

        it('returns undefined for an unknown id', async () => {
            expect(await db.findOrderById('does-not-exist')).toBeUndefined();
        });

        it('treats SQL injection in the id as a plain unknown id', async () => {
            expect(await db.findOrderById("' OR '1'='1")).toBeUndefined();
            expect(await db.getOrders()).not.toHaveLength(0);
        });
    });

    describe('addOrder', () => {
        it('persists an order and round-trips it through findOrderById', async () => {
            const created = await db.addOrder({
                sender: 'Alice',
                status: 'RECEIVED',
                contents: [
                    { name: 'Margherita Pizza', quantity: 2 },
                    { name: 'BBQ Chicken Pizza', quantity: 1 },
                    { name: 'Pepperoni Pizza', quantity: 4 }
                ]
            });

            expect(created.id).toMatch(/^order-\d+-\d{1,3}$/);
            expect(await db.findOrderById(created.id)).toEqual(created);
            expect((await db.getOrders()).map(o => o.id)).toContain(created.id);
        });

        it('stores special characters in the sender safely', async () => {
            const sender = "Robert'); DROP TABLE orders;--";
            const created = await db.addOrder({ sender, status: 'RECEIVED', contents: [{ name: 'Margherita Pizza', quantity: 1 }] });

            expect((await db.findOrderById(created.id))?.sender).toBe(sender);
            expect(await query('SELECT 1 FROM orders LIMIT 1')).toHaveLength(1);
        });

        it('rolls back the whole order when an item insert fails', async () => {
            const sender = 'Rollback Rita';
            const badItems = [{ name: 'Margherita Pizza', quantity: null as unknown as number }];

            await expect(db.addOrder({ sender, status: 'RECEIVED', contents: badItems })).rejects.toThrow();

            expect(await query('SELECT id FROM orders WHERE sender = ?', [sender])).toHaveLength(0);
        });
    });

    describe('updateOrderById', () => {
        const createOrder = () => db.addOrder({
            sender: 'Bob',
            status: 'RECEIVED',
            contents: [{ name: 'Margherita Pizza', quantity: 1 }]
        });

        it('returns null for an unknown id', async () => {
            expect(await db.updateOrderById('does-not-exist', { sender: 'Nobody' })).toBeNull();
        });

        it('updates only the provided fields', async () => {
            const created = await createOrder();

            const updated = await db.updateOrderById(created.id, { status: 'DELIVERING' });

            expect(updated).toEqual({ ...created, status: 'DELIVERING' });
            expect(await db.findOrderById(created.id)).toEqual(updated);
        });

        it('updates the sender', async () => {
            const created = await createOrder();

            const updated = await db.updateOrderById(created.id, { sender: 'Bobby' });

            expect(updated).toEqual({ ...created, sender: 'Bobby' });
        });

        it('replaces the items when contents are provided', async () => {
            const created = await createOrder();
            const contents = [
                { name: 'Pepperoni Pizza', quantity: 2 },
                { name: 'Quattro Stagioni', quantity: 5 }
            ];

            const updated = await db.updateOrderById(created.id, { contents });

            expect(updated?.contents).toEqual(contents);
            expect(await query('SELECT name FROM order_items WHERE order_id = ?', [created.id])).toHaveLength(2);
        });

        it('keeps items when contents are not provided', async () => {
            const created = await createOrder();

            const updated = await db.updateOrderById(created.id, { sender: 'Same items' });

            expect(updated?.contents).toEqual(created.contents);
        });

        it('rolls back all changes when a statement fails', async () => {
            const created = await createOrder();

            await expect(db.updateOrderById(created.id, {
                sender: 'Should not stick',
                contents: [{ name: 'Margherita Pizza', quantity: null as unknown as number }]
            })).rejects.toThrow();

            expect(await db.findOrderById(created.id)).toEqual(created);
        });
    });

    describe('deleteOrderById', () => {
        it('returns null for an unknown id', async () => {
            expect(await db.deleteOrderById('does-not-exist')).toBeNull();
        });

        it('deletes the order, returns it, and cascades to its items', async () => {
            const created = await db.addOrder({
                sender: 'Carol',
                status: 'RECEIVED',
                contents: [{ name: 'Margherita Pizza', quantity: 1 }, { name: 'BBQ Chicken Pizza', quantity: 2 }]
            });

            expect(await db.deleteOrderById(created.id)).toEqual(created);
            expect(await db.findOrderById(created.id)).toBeUndefined();
            expect(await query('SELECT id FROM order_items WHERE order_id = ?', [created.id])).toHaveLength(0);
        });

        it('returns null when deleting the same order twice', async () => {
            const created = await db.addOrder({ sender: 'Dave', status: 'RECEIVED', contents: [{ name: 'Margherita Pizza', quantity: 1 }] });

            await db.deleteOrderById(created.id);

            expect(await db.deleteOrderById(created.id)).toBeNull();
        });
    });

    describe('closeDatabase', () => {
        it('releases the pool so further queries fail until re-initialised', async () => {
            await db.closeDatabase();

            await expect(db.getOrders()).rejects.toThrow('Database not initialised');

            await db.initDatabase();
            expect(await db.getOrders()).not.toHaveLength(0);
        });
    });
});
