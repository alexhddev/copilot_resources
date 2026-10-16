import random
import time

from .model import MenuEntry, Order, OrderItem

# In-memory database for daily menu
daily_menu: list[MenuEntry] = [
    MenuEntry(
        name="Margherita Pizza",
        description="Classic pizza with fresh tomatoes, mozzarella cheese, and basil",
        imageUrl="assets/origs/margherita.png",
    ),
    MenuEntry(
        name="Pepperoni Pizza",
        description="Traditional pizza topped with pepperoni and mozzarella cheese",
        imageUrl="assets/origs/pepperoni.png",
    ),
    MenuEntry(
        name="Quattro Stagioni",
        description="Four seasons pizza with artichokes, ham, mushrooms, and olives",
        imageUrl="assets/origs/quattro.png",
    ),
    MenuEntry(
        name="Vegetarian Delight",
        description="Fresh vegetables including bell peppers, onions, mushrooms, and tomatoes",
        imageUrl="assets/origs/vegetarian.png",
    ),
    MenuEntry(
        name="BBQ Chicken Pizza",
        description="Grilled chicken with BBQ sauce, red onions, and cilantro",
        imageUrl="assets/origs/bbq-chicken.png",
    ),
]

# In-memory database for orders
orders: list[Order] = [
    Order(
        id="order-001",
        sender="John Doe",
        status="RECEIVED",
        contents=[
            OrderItem(name="Margherita Pizza", quantity=2),
            OrderItem(name="Pepperoni Pizza", quantity=1),
        ],
    ),
    Order(
        id="order-002",
        sender="Jane Smith",
        status="DELIVERING",
        contents=[
            OrderItem(name="Vegetarian Delight", quantity=1),
            OrderItem(name="BBQ Chicken Pizza", quantity=1),
        ],
    ),
    Order(
        id="order-003",
        sender="Mike Johnson",
        status="DELIVERED",
        contents=[OrderItem(name="Quattro Stagioni", quantity=3)],
    ),
]


def generate_order_id() -> str:
    timestamp = int(time.time() * 1000)
    return f"order-{timestamp}-{random.randint(0, 999)}"


def find_order_by_id(order_id: str) -> Order | None:
    return next((o for o in orders if o.id == order_id), None)


def update_order_by_id(order_id: str, updates: dict) -> Order | None:
    for index, existing in enumerate(orders):
        if existing.id == order_id:
            orders[index] = existing.model_copy(update=updates)
            return orders[index]
    return None


def add_order(sender: str, contents: list[OrderItem]) -> Order:
    new_order = Order(id=generate_order_id(), sender=sender, status="RECEIVED", contents=contents)
    orders.append(new_order)
    return new_order
