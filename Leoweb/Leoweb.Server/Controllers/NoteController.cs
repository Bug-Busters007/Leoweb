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

			return File(file.Data, "application/pdf", file.Name, enableRangeProcessing: true);
		}

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
				Name = file.FileName,
				Data = str.ToArray()
			};

			_dbContext.BinaryFile.Add(binFile);
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var newFile = new File()
			{
				Year = (Year)year,
				Subject = s,
				Data = binFile,
				Date = DateOnly.FromDateTime(DateTime.Now),
				Student = studentID
			};
			_dbContext.File.Add(newFile);

			_dbContext.SaveChanges();

			return Ok(binFile);
		}

		[HttpGet("allFilenames")]
		public IActionResult GetAllFileNames()
		{
			var dict = _dbContext.File
				.Select(f => new 
					{
						f.Data.Id,
						f.Data.Name,
						f.Year,
						subject = f.Subject.ToString(),
					})
				.ToList();

			return Ok(dict);
		}

		[HttpGet("allBranches")]
		public IActionResult GetAllBranches()
		{
			return Ok(Branch.GetBranches());
		}

		[HttpGet("allBranchesWithSubjects")]
		public IActionResult GetAllBranchesWithSubjects()
		{
			return Ok(Branch.GetDictionary().ToDictionary(
						branch => branch.Key,
						branch => branch.Value.Select(s => s.ToString()).ToArray()
					));
		}

		/*
		[HttpDelete("allFiles")]
		public IActionResult TruncateAllFiles()
		{
			_dbContext.Database.ExecuteSqlRaw("truncate table \"BinaryFile\", \"File\";");
			return Ok();
		}
		*/
	}
}
