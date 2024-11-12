using Microsoft.AspNetCore.Mvc;

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

    [HttpGet("/testCall")]
    public IActionResult Get()
    {
        return Ok("Hello World!");
    }
}