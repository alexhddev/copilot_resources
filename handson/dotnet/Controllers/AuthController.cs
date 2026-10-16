using System.Text.Json;
using AwesomePizza.Dto;
using AwesomePizza.Util;
using Microsoft.AspNetCore.Mvc;

namespace AwesomePizza.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    // Token payload: base64({"role":"admin"})
    private const string HardcodedToken = "eyJyb2xlIjoiYWRtaW4ifQ==";

    private static readonly (string Username, string Password)[] Users = { ("user", "pass") };

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var match = Array.Exists(Users, u => u.Username == request.Username && u.Password == request.Password);
        if (!match)
        {
            return StatusCode(401, new { success = false, error = "Invalid credentials" });
        }

        return Ok(new { success = true, token = HardcodedToken });
    }

    [HttpGet("protected")]
    public IActionResult GetProtectedContent()
    {
        var token = TokenUtil.ExtractBearerToken(Request);
        if (token is null || token != HardcodedToken)
        {
            return StatusCode(401, new { success = false, error = "Unauthorized", message = "Valid token required" });
        }

        return Ok(new
        {
            success = true,
            message = "Access granted",
            data = new
            {
                secretRecipes = new[] { "Margherita Supreme", "Dragon Pepperoni", "Black Truffle Delight" },
                staffDiscount = "50% off all pizzas",
                vipCode = "PIZZA-VIP-2024",
                deliveryNote = "Drivers use entrance B"
            }
        });
    }

    [HttpGet("admin")]
    public IActionResult GetAdminContent()
    {
        var token = TokenUtil.ExtractBearerToken(Request);
        if (token is null)
        {
            return StatusCode(401, new { success = false, error = "Unauthorized", message = "Token required" });
        }

        JsonElement payload;
        try
        {
            var decoded = Convert.FromBase64String(token);
            payload = JsonSerializer.Deserialize<JsonElement>(decoded);
        }
        catch
        {
            return StatusCode(401, new { success = false, error = "Unauthorized", message = "Invalid token format" });
        }

        if (payload.ValueKind == JsonValueKind.Object &&
            payload.TryGetProperty("role", out var role) &&
            role.GetString() == "admin")
        {
            return Ok(new { success = true, message = "Welcome, admin!" });
        }

        return StatusCode(403, new { success = false, error = "Forbidden", message = "Not authorised" });
    }
}
