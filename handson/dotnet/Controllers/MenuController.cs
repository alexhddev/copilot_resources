using AwesomePizza.Database;
using Microsoft.AspNetCore.Mvc;

namespace AwesomePizza.Controllers;

[ApiController]
[Route("api")]
public class MenuController : ControllerBase
{
    private readonly InMemoryDatabase _database;

    public MenuController(InMemoryDatabase database)
    {
        _database = database;
    }

    [HttpGet("daily-menu")]
    public IActionResult GetDailyMenu()
    {
        try
        {
            return Ok(new { success = true, data = _database.GetDailyMenu(), message = "Daily menu retrieved successfully" });
        }
        catch
        {
            return StatusCode(500, new { success = false, error = "Internal server error", message = "Failed to retrieve daily menu" });
        }
    }
}
