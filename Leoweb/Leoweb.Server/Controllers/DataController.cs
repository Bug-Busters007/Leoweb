using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace Leoweb.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DataController : Controller
{
    private readonly ILogger<DataController> _logger;

    public DataController(ILogger<DataController> logger)
    {
        _logger = logger;
    }

    [HttpGet("/testDataBaseConnection")]
    public IActionResult Get()
    {
        var connectionString = "Server=tcp:sqlservervonmanuel.database.windows.net,1433;Initial Catalog=LeowebDB;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication=\"Active Directory Default\"";

        using (var connection = new NpgsqlConnection(connectionString))
        {
            try
            {
                connection.Open();
                Ok("Connection established");
            }
            catch (Exception ex)
            {
                Ok($"Fehler bei der Verbindung: {ex.Message}");
            }
        }
        return Ok();
    }
}