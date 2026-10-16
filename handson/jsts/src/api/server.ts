import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { order } from '../model/Model';
import { dailyMenu, findOrderById, addOrder, updateOrderById, deleteOrderById } from './database';

// Token payload: base64({"role":"admin"})
// To generate: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
const HARDCODED_TOKEN = 'eyJyb2xlIjoiYWRtaW4ifQ==';

function extractBearerToken(req: Request): string | null {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.slice(7);
}

function requireToken(req: Request, res: Response, next: NextFunction): void {
    const token = extractBearerToken(req);
    if (!token || token !== HARDCODED_TOKEN) {
        res.status(401).json({ success: false, error: 'Unauthorized', message: 'Valid token required' });
        return;
    }
    next();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from ui directory
app.use(express.static(path.join(__dirname, '../ui')));

// CORS middleware for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// API Routes

// GET /api/daily-menu - Return the daily menu
app.get('/api/daily-menu', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: dailyMenu,
            message: 'Daily menu retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to retrieve daily menu'
        });
    }
});

// GET /api/orders/:id - Get order by ID
app.get('/api/orders/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Bad request',
                message: 'Order ID is required'
            });
        }

        const order = findOrderById(id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: `Order with ID '${id}' not found`
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to retrieve order'
        });
    }
});

// POST /api/orders - Create a new order
app.post('/api/orders', (req, res) => {
    try {
        const { sender, contents } = req.body;

        // Validation
        if (!sender || typeof sender !== 'string' || sender.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Bad request',
                message: 'Order sender is required and must be a non-empty string'
            });
        }

        if (!contents || !Array.isArray(contents) || contents.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Bad request',
                message: 'Order contents are required and must be a non-empty array'
            });
        }

        // Validate each item in contents
        for (const item of contents) {
            if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Bad request',
                    message: 'Each order item must have a valid name'
                });
            }

            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Bad request',
                    message: 'Each order item must have a valid quantity (positive number)'
                });
            }
        }

        // Create new order with default status
        const orderData = {
            sender: sender.trim(),
            status: 'RECEIVED' as const,
            contents: contents
        };

        const newOrder = addOrder(orderData);

        res.status(201).json({
            success: true,
            data: newOrder,
            message: 'Order created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to create order'
        });
    }
});

// PUT /api/orders/:id - Update an existing order
app.put('/api/orders/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { sender, status, contents } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Bad request',
                message: 'Order ID is required'
            });
        }

        // Check if order exists
        const existingOrder = findOrderById(id);
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: `Order with ID '${id}' not found`
            });
        }

        // Validate optional fields if provided
        const updateData: Partial<order> = {};

        if (sender !== undefined) {
            if (typeof sender !== 'string' || sender.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Bad request',
                    message: 'Order sender must be a non-empty string'
                });
            }
            updateData.sender = sender.trim();
        }

        if (status !== undefined) {
            const validStatuses = ['RECEIVED', 'DELIVERING', 'DELIVERED', 'CANCELED'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Bad request',
                    message: `Status must be one of: ${validStatuses.join(', ')}`
                });
            }
            updateData.status = status;
        }

        if (contents !== undefined) {
            if (!Array.isArray(contents) || contents.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Bad request',
                    message: 'Order contents must be a non-empty array'
                });
            }

            // Validate each item in contents
            for (const item of contents) {
                if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
                    return res.status(400).json({
                        success: false,
                        error: 'Bad request',
                        message: 'Each order item must have a valid name'
                    });
                }

                if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'Bad request',
                        message: 'Each order item must have a valid quantity (positive number)'
                    });
                }
            }
            updateData.contents = contents;
        }

        // Update the order
        const updatedOrder = updateOrderById(id, updateData);

        if (!updatedOrder) {
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to update order'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedOrder,
            message: 'Order updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to update order'
        });
    }
});

// DELETE /api/orders/:id - Delete an order
app.delete('/api/orders/:id', (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Bad request',
                message: 'Order ID is required'
            });
        }

        // Check if order exists
        const existingOrder = findOrderById(id);
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: `Order with ID '${id}' not found`
            });
        }

        // Delete the order
        const deleted = deleteOrderById(id);

        if (!deleted) {
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to delete order'
            });
        }

        res.status(200).json({
            success: true,
            data: null,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to delete order'
        });
    }
});

// Dummy credentials — for demo purposes only
const USERS = [{ username: 'user', password: 'pass' }];

// POST /api/login - Validate credentials and return a token
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const match = USERS.find(u => u.username === username && u.password === password);
    if (!match) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
    }
    res.status(200).json({ success: true, token: HARDCODED_TOKEN });
});

// GET /api/protected - Requires a valid token
app.get('/api/protected', requireToken, (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Access granted',
        data: {
            secretRecipes: ['Margherita Supreme', 'Dragon Pepperoni', 'Black Truffle Delight'],
            staffDiscount: '50% off all pizzas',
            vipCode: 'PIZZA-VIP-2024',
            deliveryNote: 'Drivers use entrance B'
        }
    });
});

// GET /api/admin - Decodes token and checks for role: admin
app.get('/api/admin', (req, res) => {
    const token = extractBearerToken(req);
    if (!token) {
        res.status(401).json({ success: false, error: 'Unauthorized', message: 'Token required' });
        return;
    }

    let payload: { role?: string };
    try {
        payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    } catch {
        res.status(401).json({ success: false, error: 'Unauthorized', message: 'Invalid token format' });
        return;
    }

    if (payload.role === 'admin') {
        res.status(200).json({ success: true, message: 'Welcome, admin!' });
    } else {
        res.status(403).json({ success: false, error: 'Forbidden', message: 'Not authorised' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🍕 Awesome Pizza API server running on port ${PORT}`);
});

export default app;