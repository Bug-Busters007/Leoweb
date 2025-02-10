using Microsoft.AspNetCore.Mvc;

namespace Leoweb.Server.Controllers;

[ApiController]
[Route("/")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Hello, World!");
    }
}