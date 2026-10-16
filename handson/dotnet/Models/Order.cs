namespace AwesomePizza.Models;

public class Order
{
    public string Id { get; }
    public string Sender { get; set; }
    public OrderStatus Status { get; set; }
    public List<OrderItem> Contents { get; set; }

    public Order(string id, string sender, OrderStatus status, List<OrderItem> contents)
    {
        Id = id;
        Sender = sender;
        Status = status;
        Contents = contents;
    }
}
