using DotNetEnv;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
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
			BinaryFile? file = _dbContext.BinaryFile.Where(f => f.Id == id).First();

			return File(file.Data, "application/pdf", file.Name);
		}

		[HttpPost("")]
		public async Task<IActionResult> UploadPdf(IFormFile file, string subject)
		{
			if (file == null || file.Length == 0)
			{
				return BadRequest("No file uploaded.");
			}

			if (!file.ContentType.Equals("application/pdf"))
			{
				return StatusCode(415);
			}

			var str = new MemoryStream();
			await file.CopyToAsync(str);
			var binFile = new BinaryFile()
			{
				Name = DateTime.Now.ToString("yyyyMMdd") + subject + '_' + file.FileName,
				Data = str.ToArray()
			};

			_dbContext.BinaryFile.Add(binFile);
			_dbContext.SaveChanges();

			return Ok(binFile);
		}

		[HttpGet("allFilenames")]
		public IActionResult GetAllFileNames()
		{
			var dict = _dbContext.BinaryFile
				.Select(f => new { f.Id, f.Name })
				//.ToDictionary(f => f.Id, f => f.Name);
				.ToList();

			return Ok(dict);
		}

		[HttpGet("allSubjectsFromBranch")]
		public IActionResult GetAllSubjectsFromBranch(string branch)
		{
			switch (branch.ToLower())
			{
				case "informatik":
					return Ok(Branch.Informatik.Select(s => s.ToString()).ToArray());
				case "medientechnik":
					return Ok(Branch.Medientechnik.Select(s => s.ToString().ToArray()));
				case "elektronik":
					return Ok(Branch.Elektronik.Select(s => s.ToString().ToArray()));
				case "medizintechnik":
					return Ok(Branch.Medizintechnik.Select(s => s.ToString().ToArray()));
			}
			return BadRequest(branch);
		}

		[HttpGet("allBranches")]
		public IActionResult GetAllBranches()
		{
			Type type = typeof(Branch);
			PropertyInfo[] fields = type.GetProperties(BindingFlags.Public | BindingFlags.Static);
			foreach (var item in fields.Select(f => f.Name).ToArray())
			{
				Console.WriteLine(item);
			}
			return Ok(fields.Select(f => f.Name).ToArray());
		}
	}
}
