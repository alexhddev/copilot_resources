using AwesomePizza.Models;

namespace AwesomePizza.Dto;

public class UpdateOrderRequest
{
    public string? Sender { get; set; }
    public string? Status { get; set; }
    public List<OrderItem>? Contents { get; set; }
}
