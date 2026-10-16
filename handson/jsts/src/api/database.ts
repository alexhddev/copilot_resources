import mysql, { Pool, PoolConnection, PoolOptions, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { menu_entry, order } from '../model/Model';

const DB_NAME = (process.env.DB_NAME || 'awesome_pizza').replace(/`/g, '');

const poolOptions: PoolOptions = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: Number(process.env.DB_POOL_SIZE) || 10
};

let pool: Pool | undefined;

const getPool = (): Pool => {
    if (!pool) {
        throw new Error('Database not initialised. Call initDatabase() first.');
    }
    return pool;
};

// Seed data inserted when the tables are empty
const seedMenu: menu_entry[] = [
    {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh tomatoes, mozzarella cheese, and basil",
        imageUrl: "assets/origs/margherita.png"
    },
    {
        name: "Pepperoni Pizza",
        description: "Traditional pizza topped with pepperoni and mozzarella cheese",
        imageUrl: "assets/origs/pepperoni.png"
    },
    {
        name: "Quattro Stagioni",
        description: "Four seasons pizza with artichokes, ham, mushrooms, and olives",
        imageUrl: "assets/origs/quattro.png"
    },
    {
        name: "Vegetarian Delight",
        description: "Fresh vegetables including bell peppers, onions, mushrooms, and tomatoes",
        imageUrl: "assets/origs/vegetarian.png"
    },
    {
        name: "BBQ Chicken Pizza",
        description: "Grilled chicken with BBQ sauce, red onions, and cilantro",
        imageUrl: "assets/origs/bbq-chicken.png"
    }
];

const seedOrders: order[] = [
    {
        id: "order-001",
        sender: "John Doe",
        status: "RECEIVED",
        contents: [
            { name: "Margherita Pizza", quantity: 2 },
            { name: "Pepperoni Pizza", quantity: 1 }
        ]
    },
    {
        id: "order-002",
        sender: "Jane Smith",
        status: "DELIVERING",
        contents: [
            { name: "Vegetarian Delight", quantity: 1 },
            { name: "BBQ Chicken Pizza", quantity: 1 }
        ]
    },
    {
        id: "order-003",
        sender: "Mike Johnson",
        status: "DELIVERED",
        contents: [
            { name: "Quattro Stagioni", quantity: 3 }
        ]
    }
];

type Queryable = Pool | PoolConnection;

const createSchema = async (db: Queryable): Promise<void> => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS menu_entries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            image_url VARCHAR(512) NOT NULL
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(64) PRIMARY KEY,
            seq INT AUTO_INCREMENT UNIQUE,
            sender VARCHAR(255) NOT NULL,
            status ENUM('RECEIVED', 'DELIVERING', 'DELIVERED', 'CANCELED') NOT NULL
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id VARCHAR(64) NOT NULL,
            name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
    `);
};

const insertOrderItems = async (db: Queryable, orderId: string, contents: order['contents']): Promise<void> => {
    await db.query(
        'INSERT INTO order_items (order_id, name, quantity) VALUES ?',
        [contents.map(item => [orderId, item.name, item.quantity])]
    );
};

const seedIfEmpty = async (db: Pool): Promise<void> => {
    const [menuCount] = await db.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM menu_entries');
    if (menuCount[0].count === 0) {
        await db.query(
            'INSERT INTO menu_entries (name, description, image_url) VALUES ?',
            [seedMenu.map(entry => [entry.name, entry.description, entry.imageUrl])]
        );
    }

    const [orderCount] = await db.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM orders');
    if (orderCount[0].count === 0) {
        for (const seedOrder of seedOrders) {
            await db.query(
                'INSERT INTO orders (id, sender, status) VALUES (?, ?, ?)',
                [seedOrder.id, seedOrder.sender, seedOrder.status]
            );
            await insertOrderItems(db, seedOrder.id, seedOrder.contents);
        }
    }
};

// Creates the database, tables and seed data if missing, then opens the connection pool
export const initDatabase = async (): Promise<void> => {
    const bootstrap = await mysql.createConnection(poolOptions);
    try {
        await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    } finally {
        await bootstrap.end();
    }

    pool = mysql.createPool({ ...poolOptions, database: DB_NAME });
    await createSchema(pool);
    await seedIfEmpty(pool);
};

export const closeDatabase = async (): Promise<void> => {
    await pool?.end();
    pool = undefined;
};

// Helper function to generate unique order IDs
export const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `order-${timestamp}-${random}`;
};

// Attaches items to order rows, preserving the order of the rows
const hydrateOrders = async (db: Queryable, rows: RowDataPacket[]): Promise<order[]> => {
    if (rows.length === 0) {
        return [];
    }

    const [items] = await db.query<RowDataPacket[]>(
        'SELECT order_id, name, quantity FROM order_items WHERE order_id IN (?) ORDER BY id',
        [rows.map(row => row.id)]
    );

    return rows.map(row => ({
        id: row.id,
        sender: row.sender,
        status: row.status,
        contents: items
            .filter(item => item.order_id === row.id)
            .map(item => ({ name: item.name, quantity: item.quantity }))
    }));
};

// Helper function to get the daily menu
export const getDailyMenu = async (): Promise<menu_entry[]> => {
    const [rows] = await getPool().query<RowDataPacket[]>(
        'SELECT name, description, image_url FROM menu_entries ORDER BY id'
    );
    return rows.map(row => ({
        name: row.name,
        description: row.description,
        imageUrl: row.image_url
    }));
};

// Helper function to get all orders
export const getOrders = async (): Promise<order[]> => {
    const [rows] = await getPool().query<RowDataPacket[]>('SELECT id, sender, status FROM orders ORDER BY seq');
    return hydrateOrders(getPool(), rows);
};

// Helper function to find order by ID
export const findOrderById = async (id: string): Promise<order | undefined> => {
    const [rows] = await getPool().query<RowDataPacket[]>(
        'SELECT id, sender, status FROM orders WHERE id = ?',
        [id]
    );
    return (await hydrateOrders(getPool(), rows))[0];
};

// Runs the callback in a transaction, rolling back on error
const withTransaction = async <T>(callback: (conn: PoolConnection) => Promise<T>): Promise<T> => {
    const conn = await getPool().getConnection();
    try {
        await conn.beginTransaction();
        const result = await callback(conn);
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

// Helper function to update order by ID
export const updateOrderById = async (id: string, updatedOrder: Partial<order>): Promise<order | null> => {
    return withTransaction(async conn => {
        const [existing] = await conn.query<RowDataPacket[]>(
            'SELECT id FROM orders WHERE id = ? FOR UPDATE',
            [id]
        );
        if (existing.length === 0) {
            return null;
        }

        if (updatedOrder.sender !== undefined) {
            await conn.query('UPDATE orders SET sender = ? WHERE id = ?', [updatedOrder.sender, id]);
        }
        if (updatedOrder.status !== undefined) {
            await conn.query('UPDATE orders SET status = ? WHERE id = ?', [updatedOrder.status, id]);
        }
        if (updatedOrder.contents !== undefined) {
            await conn.query('DELETE FROM order_items WHERE order_id = ?', [id]);
            await insertOrderItems(conn, id, updatedOrder.contents);
        }

        const [rows] = await conn.query<RowDataPacket[]>(
            'SELECT id, sender, status FROM orders WHERE id = ?',
            [id]
        );
        return (await hydrateOrders(conn, rows))[0];
    });
};

// Helper function to delete order by ID
export const deleteOrderById = async (id: string): Promise<order | null> => {
    return withTransaction(async conn => {
        const [rows] = await conn.query<RowDataPacket[]>(
            'SELECT id, sender, status FROM orders WHERE id = ? FOR UPDATE',
            [id]
        );
        const existing = (await hydrateOrders(conn, rows))[0];
        if (!existing) {
            return null;
        }

        const [result] = await conn.query<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);
        return result.affectedRows > 0 ? existing : null;
    });
};

// Helper function to add new order
export const addOrder = async (orderData: Omit<order, 'id'>): Promise<order> => {
    const newOrder: order = {
        id: generateOrderId(),
        ...orderData
    };

    await withTransaction(async conn => {
        await conn.query(
            'INSERT INTO orders (id, sender, status) VALUES (?, ?, ?)',
            [newOrder.id, newOrder.sender, newOrder.status]
        );
        await insertOrderItems(conn, newOrder.id, newOrder.contents);
    });

    return {
        ...newOrder,
        contents: newOrder.contents.map(item => ({ name: item.name, quantity: item.quantity }))
    };
};
