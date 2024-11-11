using Microsoft.AspNetCore.Mvc;

namespace Leoweb.Server.Controllers;

public class DataController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}