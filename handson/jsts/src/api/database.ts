import { menu_entry, order } from '../model/Model';

// In-memory database for daily menu
export const dailyMenu: menu_entry[] = [
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

// In-memory database for orders
export const orders: order[] = [
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

// Helper function to generate unique order IDs
export const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `order-${timestamp}-${random}`;
};

// Helper function to find order by ID
export const findOrderById = (id: string): order | undefined => {
    return orders.find(order => order.id === id);
};

// Helper function to update order by ID
export const updateOrderById = (id: string, updatedOrder: Partial<order>): order | null => {
    const index = orders.findIndex(order => order.id === id);
    if (index === -1) {
        return null;
    }
    
    orders[index] = { ...orders[index], ...updatedOrder };
    return orders[index];
};

// Helper function to add new order
export const addOrder = (orderData: Omit<order, 'id'>): order => {
    const newOrder: order = {
        id: generateOrderId(),
        ...orderData
    };
    
    orders.push(newOrder);
    return newOrder;
};