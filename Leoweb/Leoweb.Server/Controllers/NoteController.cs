using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
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
		
		[HttpGet("fileIdsWithLikesFromUser")]
		public IActionResult GetFileIdsWithLikesFromUser()
		{

			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var fileIds = _dbContext.UserFileLike.Where(like => like.UserId == studentID).Select(like => like.FileId).ToList();
			return Ok(fileIds);
		}
		
		[Authorize]
		[HttpPost("like/{id}")]
		public IActionResult LikeFile([FromRoute] int id)
		{
			foreach (var claim in User.Claims)
			{
				Console.WriteLine("Claim: " + claim.Type + ":" + claim.Value);
			}
			var studentId = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var file = _dbContext.File.First(f => f.Data.Id == id);
			if (file == null)
			{
				return NotFound($"File with ID {id} not found.");
			}
			
			var fileHasBeenLikedByUser = _dbContext.UserFileLike.Where(like => like.FileId == id && like.UserId == studentId).Any();
			if (fileHasBeenLikedByUser)
			{
				return BadRequest("File has already been liked by user.");
			}
			var like = new UserFileLike()
			{
				UserId = studentId,
				FileId = id
			};
			_dbContext.UserFileLike.Add(like);
			_dbContext.SaveChanges();
			return Ok();
		}
		
		[HttpDelete("unlike/{id}")]
		public IActionResult UnlikeFile([FromRoute] int id)
		{
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var file = _dbContext.File.Where(f => f.Data.Id == id).First();
			if (file == null)
			{
				return NotFound($"File with ID {id} not found.");
			}
			
			var like = _dbContext.UserFileLike.Where(like => like.FileId == id && like.UserId == studentID).First();
			if (like == null)
			{
				return BadRequest("File has not been liked by user.");
			}
			_dbContext.UserFileLike.Remove(like);
			_dbContext.SaveChanges();
			return Ok();
		}
		
		[HttpGet("numOfLikes/{id}")]
		public IActionResult GetNumOfLikes([FromRoute] int id)
		{
			var likes = _dbContext.UserFileLike.Where(like => like.FileId == id).Count();
			return Ok(likes);
		}

		[HttpGet("{id}")]
		public IActionResult GetPdfToView([FromRoute] int id)
		{
			var file = _dbContext.BinaryFile.Where(f => f.Id == id).First();
			if (file == null)
			{
				return NotFound($"File with ID {id} not found.");
			}

			Response.Headers.Append("Content-Disposition", $"inline; filename=\"{file.Name}\"; filename*=UTF-8''{Uri.EscapeDataString(file.Name)}");
			Response.Headers.Append("Content-Type", "application/pdf");
			return File(file.Data, "application/pdf");
		}

		[HttpGet("{id}/download")]
		public IActionResult GetPdfToDownload([FromRoute] int id)
		{
			var file = _dbContext.BinaryFile.Where(f => f.Id == id).First();
			if (file == null)
			{
				return NotFound($"File with ID {id} not found.");
			}

			return File(file.Data, "application/pdf", file.Name);
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
				Name = ReplaceGermanChars(file.FileName),
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
				StudentId = studentID
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
					student = _dbContext.Student.Where(s => s.Id == f.Student.Id).First().Email,
					subject = f.Subject.ToString(),
				})
				.ToList();

			return Ok(dict);
		}

		[HttpGet("allFilenamesFromStudent")]
		public IActionResult GetAllFileNamesFromStudent()
		{ 
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var dict = _dbContext.File.Where(f => f.Student.Id == studentID)
				.Select(f => new 
				{
					f.Data.Id,
					f.Data.Name,
					f.Year,
					Subject = f.Subject.ToString(),
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
		
		[HttpDelete("{id}")]
		public IActionResult DeleteFile(int id)
		{
			bool success = false;
			try
			{
				var file = _dbContext.BinaryFile.Find(id);
          
				if (file == null)
				{
					throw new Exception($"File with ID {id} not found.");
				}
          
				_dbContext.BinaryFile.Remove(file);
          
				int affectedRows = _dbContext.SaveChanges();
          
				success = affectedRows > 0;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error deleting file with ID {id}: {ex.Message}");
			}
  
			if (success)
			{
				return NoContent();
			}
			else
			{
				return NotFound($"File with ID {id} not found");
			}
		}

		private static string ReplaceGermanChars(string text)
		{
			string pattern = "[ÜüÖöÄäß]";

			return Regex.Replace(text, pattern, match =>
			{
				return match.Value switch
				{
					"Ü" => "Ue",
					"ü" => "ue",
					"Ö" => "Oe",
					"ö" => "oe",
					"Ä" => "Ae",
					"ä" => "ae",
					"ß" => "ss",
					_ => match.Value
				};
			});
		}
	}
}
