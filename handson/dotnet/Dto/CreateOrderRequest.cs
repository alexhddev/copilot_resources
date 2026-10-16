using AwesomePizza.Models;

namespace AwesomePizza.Dto;

public class CreateOrderRequest
{
    public string? Sender { get; set; }
    public List<OrderItem>? Contents { get; set; }
}
