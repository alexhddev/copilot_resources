using AwesomePizza.Database;
using AwesomePizza.Dto;
using AwesomePizza.Models;
using Microsoft.AspNetCore.Mvc;

namespace AwesomePizza.Controllers;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly InMemoryDatabase _database;

    public OrderController(InMemoryDatabase database)
    {
        _database = database;
    }

    [HttpGet("{id}")]
    public IActionResult GetOrder(string id)
    {
        try
        {
            var order = _database.FindOrderById(id);
            if (order is null)
            {
                return NotFoundResponse($"Order with ID '{id}' not found");
            }

            return Ok(new { success = true, data = order, message = "Order retrieved successfully" });
        }
        catch
        {
            return StatusCode(500, new { success = false, error = "Internal server error", message = "Failed to retrieve order" });
        }
    }

    [HttpPost]
    public IActionResult CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            var sender = request.Sender;
            if (string.IsNullOrWhiteSpace(sender))
            {
                return BadRequestResponse("Order sender is required and must be a non-empty string");
            }

            var contents = request.Contents;
            if (contents is null || contents.Count == 0)
            {
                return BadRequestResponse("Order contents are required and must be a non-empty array");
            }

            var itemError = ValidateItems(contents);
            if (itemError is not null)
            {
                return BadRequestResponse(itemError);
            }

            var newOrder = _database.AddOrder(sender.Trim(), contents);
            return StatusCode(201, new { success = true, data = newOrder, message = "Order created successfully" });
        }
        catch
        {
            return StatusCode(500, new { success = false, error = "Internal server error", message = "Failed to create order" });
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateOrder(string id, [FromBody] UpdateOrderRequest request)
    {
        try
        {
            var order = _database.FindOrderById(id);
            if (order is null)
            {
                return NotFoundResponse($"Order with ID '{id}' not found");
            }

            if (request.Sender is not null)
            {
                if (string.IsNullOrWhiteSpace(request.Sender))
                {
                    return BadRequestResponse("Order sender must be a non-empty string");
                }
                order.Sender = request.Sender.Trim();
            }

            if (request.Status is not null)
            {
                if (!Enum.TryParse<OrderStatus>(request.Status, false, out var status))
                {
                    var valid = string.Join(", ", Enum.GetNames<OrderStatus>());
                    return BadRequestResponse($"Status must be one of: {valid}");
                }
                order.Status = status;
            }

            if (request.Contents is not null)
            {
                if (request.Contents.Count == 0)
                {
                    return BadRequestResponse("Order contents must be a non-empty array");
                }

                var itemError = ValidateItems(request.Contents);
                if (itemError is not null)
                {
                    return BadRequestResponse(itemError);
                }
                order.Contents = request.Contents;
            }

            return Ok(new { success = true, data = order, message = "Order updated successfully" });
        }
        catch
        {
            return StatusCode(500, new { success = false, error = "Internal server error", message = "Failed to update order" });
        }
    }

    private static string? ValidateItems(List<OrderItem> items)
    {
        foreach (var item in items)
        {
            if (string.IsNullOrWhiteSpace(item.Name))
            {
                return "Each order item must have a valid name";
            }
            if (item.Quantity is null || item.Quantity <= 0)
            {
                return "Each order item must have a valid quantity (positive number)";
            }
        }
        return null;
    }

    private BadRequestObjectResult BadRequestResponse(string message) =>
        BadRequest(new { success = false, error = "Bad request", message });

    private NotFoundObjectResult NotFoundResponse(string message) =>
        NotFound(new { success = false, error = "Not found", message });
}
