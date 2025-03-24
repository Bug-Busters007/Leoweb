using Leoweb.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Leoweb.Server.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ScraperController : Controller
{
    private readonly ScraperService _scraperService;

    public ScraperController(ScraperService scraperService)
    {
        _scraperService = scraperService;
    }

    [HttpGet("events")]
    public async Task<ActionResult<List<EventData>>> GetEvents()
    {
        var events = await _scraperService.ScrapeEventsAsync();
        return Ok(events);
    }
}