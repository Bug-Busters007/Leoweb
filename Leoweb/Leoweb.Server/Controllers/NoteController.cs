using DotNetEnv;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Leoweb.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class NotesController : ControllerBase
	{
		private readonly ApplicationDbContext _dbContext;

		public NotesController()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>().Options;
			_dbContext = new ApplicationDbContext(options);
		}

		[HttpGet("{id}")]
		public IActionResult GetPdf([FromRoute] int id)
		{
			BinaryFile? file = _dbContext.BinaryFiles.Where(f => f.Id == id).First();

			return File(file.Data, "application/pdf", file.Name);
		}

		[HttpPost("")]
		public async Task<IActionResult> UploadPdf(IFormFile file)
		{
			if (file == null || file.Length == 0 || !file.ContentType.Equals("application/pdf"))
			{
				return BadRequest("No file uploaded.");
			}

			var str = new MemoryStream();
			await file.CopyToAsync(str);
			var binFile = new BinaryFile()
			{
				Name = file.FileName,
				Data = str.ToArray()
			};

			_dbContext.BinaryFiles.Add(binFile);
			_dbContext.SaveChanges();

			return Ok(binFile);
		}

		[HttpGet("allFilenames")]
		public IActionResult GetAllFileNames()
		{
			var dict = _dbContext.BinaryFiles
				.Select(f => new { f.Id, f.Name })
				//.ToDictionary(f => f.Id, f => f.Name);
				.ToList();

			return Ok(dict);
		}
	}
}
