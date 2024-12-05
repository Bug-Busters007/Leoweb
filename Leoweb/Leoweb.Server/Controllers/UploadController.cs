using DotNetEnv;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;

namespace Leoweb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
		private string connectionString
		{
			get
			{
				// in Leoweb.Server eine .env Datei erstellen und den DB String einfügen
				// DB_CONNECTION_STRING=string ohne ""
				Env.Load();
				return Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "";
			}
		}
		private readonly ApplicationDbContext _dbContext;

        public UploadController()
        {
			// in Leoweb.Server eine .env Datei erstellen und den DB String einfügen
			// DB_CONNECTION_STRING=string ohne ""
			Env.Load();
            _dbContext = new ApplicationDbContext(new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseNpgsql(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING"))
                .Options);
		}

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
			if (file == null || file.Length == 0 || !file.ContentType.Equals("application/pdf"))
            {
                return BadRequest("No file uploaded.");
            }

            var str = new MemoryStream();
            await file.CopyToAsync(str);
            var binFile = new BinaryFile()
            {
                Data = str.ToArray()
            };

            _dbContext.BinaryFiles.Add(binFile);
            _dbContext.SaveChanges();

            return Ok(binFile);
        }
    }
}