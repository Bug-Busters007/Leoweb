using DotNetEnv;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Leoweb.Server.Controllers
{
	public class NotesToDatabase : ControllerBase
	{
		private readonly ApplicationDbContext _dbContext;

		public NotesToDatabase()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>().Options;
			_dbContext = new ApplicationDbContext(options);
		}

		[HttpGet("/notes")]
		public IActionResult GetPdf([FromQuery] int? id)
		{
			BinaryFile? file;
			if (id != null)
			{
				file = _dbContext.BinaryFiles.FirstOrDefault(f => f.Id == id);
			}
			else
			{
				file = _dbContext.BinaryFiles.FirstOrDefault();
			}

			if (file == null)
			{
				return NotFound("No Files in the Database");
			}

			return File(file.Data, "application/pdf", file.Name);
		}

		[HttpPost("/notes")]
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
	}
}
