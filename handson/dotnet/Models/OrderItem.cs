namespace AwesomePizza.Models;

public class OrderItem
{
    public string? Name { get; set; }
    public int? Quantity { get; set; }

    public OrderItem()
    {
    }

    public OrderItem(string name, int quantity)
    {
        Name = name;
        Quantity = quantity;
    }
}
