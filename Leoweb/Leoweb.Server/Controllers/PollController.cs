using Leoweb.Server.Database.Models;
using Leoweb.Server.StaticModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

		[HttpPost("/")]
		public async Task<IActionResult> CreateNewPoll([FromBody] PollJSON poll)
		{
			var newPoll = new Poll()
			{
				Headline = poll.Headline,
				Description = poll.Description,
				Created = DateTime.Now,
				Close = poll.Close,
				Release = poll.Release,
			};

			foreach (string s in poll.Choices)
			{
				var choice = new Choice()
				{
					Description = s,
					Poll = newPoll
				};
				await _dbContext.AddAsync(choice);
			}
			await _dbContext.AddAsync(newPoll);
			_dbContext.SaveChanges();
			return Ok(newPoll);
		}

		[HttpPost("vote")]
		public async Task<IActionResult> CreateNewVote([FromBody] VoteJSON vote)
		{
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var newVote = new Vote()
			{
				Student = _dbContext.Student.Find(studentID)!,
				Choice = vote.Choice,
				Poll = _dbContext.Poll.Find(vote.PollId)!
			};
			await _dbContext.AddAsync(newVote);
			_dbContext.SaveChanges();
			return Ok(newVote);
		}

		[HttpPost("poll/close")]
		public IActionResult ClosePoll([FromRoute] int pollId, [FromBody] DateTime? date)
		{
			var poll = _dbContext.Poll.Find(pollId);
			if (poll == null)
			{
				return BadRequest("Poll not found");
			}
			poll.Close = date == null ? DateTime.Now : date;
			_dbContext.SaveChanges();
			return Ok(poll);
		}

		[HttpGet("poll/overview")]
		public IActionResult GetPollOverview([FromRoute] int pollId)
		{
			var poll = _dbContext.Poll.Find(pollId);
			if ( poll == null )
			{
				return BadRequest("Poll not found");
			}
			var dict = new Dictionary<string, int>();
			foreach (var x in _dbContext.Choice.Where(c => c.Poll == poll))
			{
				_dbContext.Vote.Where(c => c.Poll == poll);
			}
			var info = new PollOverview()
			{
				Id = poll.Id,
				Headline = poll.Headline,
				Description = poll.Description
			};

			return Ok(info);
		}
	}
}
