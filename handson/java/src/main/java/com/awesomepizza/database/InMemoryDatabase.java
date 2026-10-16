package com.awesomepizza.database;

import com.awesomepizza.model.MenuEntry;
import com.awesomepizza.model.Order;
import com.awesomepizza.model.OrderItem;
import com.awesomepizza.model.OrderStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class InMemoryDatabase {

    private final List<MenuEntry> dailyMenu = List.of(
            new MenuEntry("Margherita Pizza", "Classic pizza with fresh tomatoes, mozzarella cheese, and basil", "assets/origs/margherita.png"),
            new MenuEntry("Pepperoni Pizza", "Traditional pizza topped with pepperoni and mozzarella cheese", "assets/origs/pepperoni.png"),
            new MenuEntry("Quattro Stagioni", "Four seasons pizza with artichokes, ham, mushrooms, and olives", "assets/origs/quattro.png"),
            new MenuEntry("Vegetarian Delight", "Fresh vegetables including bell peppers, onions, mushrooms, and tomatoes", "assets/origs/vegetarian.png"),
            new MenuEntry("BBQ Chicken Pizza", "Grilled chicken with BBQ sauce, red onions, and cilantro", "assets/origs/bbq-chicken.png")
    );

    private final List<Order> orders = new CopyOnWriteArrayList<>(List.of(
            new Order("order-001", "John Doe", OrderStatus.RECEIVED, new CopyOnWriteArrayList<>(List.of(
                    new OrderItem("Margherita Pizza", 2),
                    new OrderItem("Pepperoni Pizza", 1)
            ))),
            new Order("order-002", "Jane Smith", OrderStatus.DELIVERING, new CopyOnWriteArrayList<>(List.of(
                    new OrderItem("Vegetarian Delight", 1),
                    new OrderItem("BBQ Chicken Pizza", 1)
            ))),
            new Order("order-003", "Mike Johnson", OrderStatus.DELIVERED, new CopyOnWriteArrayList<>(List.of(
                    new OrderItem("Quattro Stagioni", 3)
            )))
    ));

    public List<MenuEntry> getDailyMenu() {
        return dailyMenu;
    }

    public Optional<Order> findOrderById(String id) {
        return orders.stream().filter(order -> order.getId().equals(id)).findFirst();
    }

    public Order addOrder(String sender, List<OrderItem> contents) {
        Order newOrder = new Order(generateOrderId(), sender, OrderStatus.RECEIVED, contents);
        orders.add(newOrder);
        return newOrder;
    }

    private String generateOrderId() {
        long timestamp = System.currentTimeMillis();
        int random = ThreadLocalRandom.current().nextInt(1000);
        return "order-" + timestamp + "-" + random;
    }
}
