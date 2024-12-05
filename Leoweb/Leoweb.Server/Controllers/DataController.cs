using DotNetEnv;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Leoweb.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DataController : Controller
{
    private readonly ApplicationDbContext _dbContext;

    public DataController()
    {
        Env.Load();
        _dbContext = new ApplicationDbContext(new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseNpgsql(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING"))
                .Options);

	}    

    [HttpGet("/getFirstPdf")]
    public IActionResult GetFirstPdf()
    {
        var data = _dbContext.BinaryFiles.FirstOrDefault();

        if (data == null || data.Data == null)
        {
            return NotFound("File not found");
        }

        return File(data.Data, "application/pdf", "document.pdf");
    }
}