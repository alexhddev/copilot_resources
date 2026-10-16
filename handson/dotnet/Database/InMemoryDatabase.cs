using AwesomePizza.Models;

namespace AwesomePizza.Database;

public class InMemoryDatabase
{
    private readonly object _lock = new();

    private readonly List<MenuEntry> _dailyMenu = new()
    {
        new MenuEntry("Margherita Pizza", "Classic pizza with fresh tomatoes, mozzarella cheese, and basil", "assets/origs/margherita.png"),
        new MenuEntry("Pepperoni Pizza", "Traditional pizza topped with pepperoni and mozzarella cheese", "assets/origs/pepperoni.png"),
        new MenuEntry("Quattro Stagioni", "Four seasons pizza with artichokes, ham, mushrooms, and olives", "assets/origs/quattro.png"),
        new MenuEntry("Vegetarian Delight", "Fresh vegetables including bell peppers, onions, mushrooms, and tomatoes", "assets/origs/vegetarian.png"),
        new MenuEntry("BBQ Chicken Pizza", "Grilled chicken with BBQ sauce, red onions, and cilantro", "assets/origs/bbq-chicken.png"),
    };

    private readonly List<Order> _orders = new()
    {
        new Order("order-001", "John Doe", OrderStatus.RECEIVED, new List<OrderItem>
        {
            new("Margherita Pizza", 2),
            new("Pepperoni Pizza", 1),
        }),
        new Order("order-002", "Jane Smith", OrderStatus.DELIVERING, new List<OrderItem>
        {
            new("Vegetarian Delight", 1),
            new("BBQ Chicken Pizza", 1),
        }),
        new Order("order-003", "Mike Johnson", OrderStatus.DELIVERED, new List<OrderItem>
        {
            new("Quattro Stagioni", 3),
        }),
    };

    public IReadOnlyList<MenuEntry> GetDailyMenu() => _dailyMenu;

    public Order? FindOrderById(string id)
    {
        lock (_lock)
        {
            return _orders.FirstOrDefault(o => o.Id == id);
        }
    }

    public Order AddOrder(string sender, List<OrderItem> contents)
    {
        var order = new Order(GenerateOrderId(), sender, OrderStatus.RECEIVED, contents);
        lock (_lock)
        {
            _orders.Add(order);
        }
        return order;
    }

    private static string GenerateOrderId()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var random = Random.Shared.Next(1000);
        return $"order-{timestamp}-{random}";
    }
}
