using System.Text.Json.Serialization;
using AwesomePizza.Database;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
builder.WebHost.UseUrls($"http://localhost:{port}");

builder.Services.AddSingleton<InMemoryDatabase>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

const string corsPolicy = "AwesomePizzaCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.AllowAnyOrigin()
              .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .WithHeaders("Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization");
    });
});

var app = builder.Build();

app.UseCors(corsPolicy);
app.MapControllers();

app.Run();
