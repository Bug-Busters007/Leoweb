using DotNetEnv;
using Leoweb.Server.Database.Models;
using Leoweb.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using static System.Runtime.InteropServices.JavaScript.JSType;
using File = Leoweb.Server.Database.Models.File;

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

		/// <summary>
		/// 
		/// </summary>
		/// <param name="file"></param>
		/// <param name="subject"></param>
		/// <param name="year">0 based</param>
		/// <returns></returns>
		[HttpPost("")]
		public async Task<IActionResult> UploadPdf(IFormFile file, string subject, int year)
		{
			if (file == null || file.Length == 0)
			{
				return BadRequest("No/Empty file uploaded.");
			}

			if (!file.ContentType.Equals("application/pdf"))
			{
				return StatusCode(415);
			}

			Subject s = Enum.Parse<Subject>(subject);
			var str = new MemoryStream();
			await file.CopyToAsync(str);
			var binFile = new BinaryFile()
			{
				Name = DateTime.Now.ToString("yyyyMMdd") + s.ToString() + '_' + file.FileName,
				Data = str.ToArray()
			};

			_dbContext.BinaryFile.Add(binFile);
			//Student student = await NoteService.GetCurrentStudent();
			//var newFile = new File()
			//{
			//	Year = (Year)year,
			//	Subject = s,
			//	Data = binFile,
			//	Date = DateOnly.FromDateTime(DateTime.Now),
			//	Student = student
			//};
			//_dbContext.File.Add(newFile);


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
					return Ok(Branch.Informatik.Select(s => s.ToString()));
				case "medientechnik":
					return Ok(Branch.Medientechnik.Select(s => s.ToString()));
				case "elektronik":
					return Ok(Branch.Elektronik.Select(s => s.ToString()));
				case "medizintechnik":
					return Ok(Branch.Medizintechnik.Select(s => s.ToString()));
			}
			return BadRequest(branch);
		}

		[HttpGet("allBranches")]
		public IActionResult GetAllBranches()
		{
			Type type = typeof(Branch);
			PropertyInfo[] fields = type.GetProperties(BindingFlags.Public | BindingFlags.Static);
			return Ok(fields.Select(f => f.Name).ToArray());
		}
	}
}
