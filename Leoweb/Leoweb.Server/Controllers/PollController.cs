using Leoweb.Server.Database.Models;
using Leoweb.Server.Services;
using Leoweb.Server.StaticModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Expressions;
using System.Linq;
using System.Net;

namespace Leoweb.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class PollController : ControllerBase
	{
		private readonly ApplicationDbContext _dbContext;

		public PollController()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>().Options;
			_dbContext = new ApplicationDbContext(options);
		}

		[HttpPost("")]
		public async Task<IActionResult> CreateNewPoll([FromBody] PollJSON poll)
		{
			var newPoll = new Poll()
			{
				Headline = poll.Headline,
				Description = poll.Description,
				Created = DateTime.Now.ToUniversalTime(),
				Close = poll.Close,
				Release = poll.Release ?? DateTime.Now,
				StudentId = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value
			};

			foreach (string s in poll.Choices)
			{
				await _dbContext.AddAsync(new Choice()
				{
					Description = s,
					Poll = newPoll
				});
			}

			foreach (var y in poll.Year)
			{
				await _dbContext.AddAsync(new PollYear()
				{
					Poll = newPoll,
					Year = (Year)y
				});
			}

			foreach (var b in poll.Branch)
			{
				await _dbContext.AddAsync(new PollBranch()
				{
					Poll = newPoll,
					Branch = b
				});
			}

			await _dbContext.AddAsync(newPoll);
			_dbContext.SaveChanges();
			return Ok(newPoll);
		}

		[HttpPatch("{pollId}/update")]
		public async Task<IActionResult> PatchPoll([FromRoute] int pollId, [FromBody] PollJSON poll)
		{
			var existingPoll = await _dbContext.Poll.FindAsync(pollId);
			if (existingPoll == null)
			{
				return BadRequest("Poll not found");
			}

			existingPoll.Headline = poll.Headline ?? existingPoll.Headline;
			existingPoll.Description = poll.Description ?? existingPoll.Description;
			existingPoll.Release = poll.Release ?? existingPoll.Release;
			existingPoll.Close = poll.Close ?? existingPoll.Close;

			var pollYears = _dbContext.PollYear.Where(py => py.PollId == existingPoll.Id).ToList();
			_dbContext.PollYear.RemoveRange(pollYears);
			foreach (var y in poll.Year)
			{
				await _dbContext.AddAsync(new PollYear()
				{
					Poll = existingPoll,
					Year = (Year)y
				});
			}

			var pollBranches = _dbContext.PollBranch.Where(pb => pb.PollId == existingPoll.Id).ToList();
			_dbContext.PollBranch.RemoveRange(pollBranches);
			foreach (var b in poll.Branch)
			{
				await _dbContext.AddAsync(new PollBranch()
				{
					Poll = existingPoll,
					Branch = b
				});
			}

			var pollChoices = _dbContext.Choice.Where(c => c.PollId == existingPoll.Id).ToList();
			_dbContext.Choice.RemoveRange(pollChoices);
			foreach (string s in poll.Choices)
			{
				await _dbContext.AddAsync(new Choice()
				{
					Description = s,
					Poll = existingPoll
				});
			}

			await _dbContext.SaveChangesAsync();

			return Ok(existingPoll);
		}

		[HttpPut("vote")]
		public async Task<IActionResult> CreateNewVote([FromBody] VoteJSON voteJSON)
		{
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var vote = _dbContext.Vote
				.Where(v => v.StudentId == studentID && v.PollId == voteJSON.PollId)
				.FirstOrDefault();
			if (vote != null)
			{
				vote.Choice = _dbContext.Choice.First(c => c.PollId == voteJSON.PollId && c.Description == voteJSON.Choice);
				await _dbContext.SaveChangesAsync();
				return Ok(vote);
			}
			var newVote = new Vote()
			{
				StudentId = studentID,
				Choice = _dbContext.Choice.First(c => c.PollId == voteJSON.PollId && c.Description == voteJSON.Choice),
				Poll = _dbContext.Poll.Find(voteJSON.PollId)!
			};
			_dbContext.Add(newVote);
			await _dbContext.SaveChangesAsync();
			return Ok(newVote);
		}

		[HttpPatch("{pollId}/close")]
		public IActionResult ClosePoll([FromRoute] int pollId, [FromBody] DateTime? date)
		{
			var poll = _dbContext.Poll.Find(pollId);
			if (poll == null)
			{
				return BadRequest("Poll not found");
			}

			poll.Close = date == null ? DateTime.Now.ToUniversalTime() : ((DateTime)date).ToUniversalTime();
			_dbContext.SaveChanges();
			return Ok(poll);
		}

		[HttpGet("all")]
		public async Task<IActionResult> GetAllPolls()
		{
			var result = await new PollService(_dbContext).GetAllPolls();

			return Ok(result);
		}

		[HttpGet("{pollId}/overview")]
		public async Task<IActionResult> GetPollOverview([FromRoute] int pollId)
		{
			var poll = _dbContext.Poll.Find(pollId);
			if (poll == null)
			{
				return BadRequest("Poll not found");
			}

			var info = await new PollService(_dbContext).GetPollOverview(pollId, poll);

			return Ok(info);
		}

		[HttpGet("user/pollNames")]
		public async Task<IActionResult> GetPollNames()
		{
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			Console.WriteLine(studentID);
			var polls = await _dbContext.Poll
				.Where(v => v.StudentId == studentID)
				.Select(p => new { p.Id, name = p.Headline })
				.ToArrayAsync();
			return Ok(polls);
		}

		[HttpDelete("{id}")]
		public IActionResult DeletePoll([FromRoute] int id)
		{
			bool success = false;
			try
			{
				var poll = _dbContext.Poll.Find(id);
          
				if (poll == null)
				{
					throw new Exception($"Poll with ID {id} not found.");
				}
          
				_dbContext.Poll.Remove(poll);
          
				int affectedRows = _dbContext.SaveChanges();
          
				success = affectedRows > 0;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error deleting poll with ID {id}: {ex.Message}");
			}
  
			if (success)
			{
				return NoContent();
			}
			else
			{
				return NotFound($"Poll with ID {id} not found");
			}
		}

		[HttpGet("{pollId}/vote")]
		public async Task<IActionResult> GetStudentVotes([FromRoute] int pollId)
		{
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var vote = _dbContext.Vote
				.Where(v => v.StudentId == studentID && v.Poll.Id == pollId)
				.Select(v => new { choice = v.Choice.Description })
				.ToArray()
				.FirstOrDefault();

			return Ok(vote);
		}
	}
}
