using Leoweb.Server.Database.Models;
using Leoweb.Server.StaticModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
				Release = poll.Release
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

		[HttpPost("vote")]
		public async Task<IActionResult> CreateNewVote([FromBody] VoteJSON vote)
		{
			var studentID = User.Claims.FirstOrDefault(u => u.Type == "UserId")!.Value;
			var newVote = new Vote()
			{
				StudentId = studentID,
				Choice = _dbContext.Choice.First(c => c.PollId == vote.PollId && c.Description == vote.Choice),
				Poll = _dbContext.Poll.Find(vote.PollId)!
			};
			await _dbContext.AddAsync(newVote);
			_dbContext.SaveChanges();
			return Ok(newVote);
		}

		[HttpPost("{pollId}/close")]
		public IActionResult ClosePoll([FromRoute] int pollId, [FromBody] DateTime? date)
		{
			var poll = _dbContext.Poll.Find(pollId);
			if (poll == null)
			{
				return BadRequest("Poll not found");
			}
			poll.Close = date == null ? DateTime.Now.ToUniversalTime() : ((DateTime) date).ToUniversalTime();
			_dbContext.SaveChanges();
			return Ok(poll);
		}
		
		[HttpGet("all")]
		public async Task<IActionResult> GetAllPolls()
		{
			var polls = await _dbContext.Poll
				.GroupJoin(
					_dbContext.Choice,
					poll => poll.Id,
					choice => choice.Poll.Id,
					(poll, choices) => new { poll, choices }
				)
				.SelectMany(
					pc => pc.choices.DefaultIfEmpty(),
					(pc, choice) => new { pc.poll, choice }
				)
				.GroupJoin(
					_dbContext.Vote,
					pc => pc.poll.Id,
					vote => vote.Poll.Id,
					(pc, votes) => new { pc.poll, pc.choice, votes }
				)
				.SelectMany(
					pvc => pvc.votes.DefaultIfEmpty(),
					(pvc, vote) => new
					{
						pvc.poll,
						pvc.choice,
						VoteDescription = pvc.choice!.Description,
						VoteCount = vote != null ? 1 : 0
					}
				)
				.GroupBy(x => new { x.poll.Id, x.poll.Headline, x.poll.Description })
				.ToListAsync();

			var result = polls.Select(grouped => new PollOverview
			{
				Id = grouped.Key.Id,
				Headline = grouped.Key.Headline,
				Description = grouped.Key.Description,
				Votes = grouped
					.Where(x => x.VoteDescription != null)
					.GroupBy(x => x.VoteDescription)
					.ToDictionary(g => g.Key, g => g.Sum(v => v.VoteCount)),
				Year = _dbContext.PollYear.Where(y => y.PollId == grouped.Key.Id).Select(y => (int)y.Year).ToArray(),
				Branch = _dbContext.PollBranch.Where(b => b.PollId == grouped.Key.Id).Select(b => b.Branch).ToArray(),
			})
			.ToList();

			return Ok(result);
		}

		[HttpGet("{pollId}/overview")]
		public async Task<IActionResult> GetPollOverview([FromRoute] int pollId)
		{
			Console.WriteLine(pollId);
			var poll = _dbContext.Poll.Find(pollId);
			if ( poll == null )
			{
				return BadRequest("Poll not found");
			}

			var dict = await _dbContext.Vote
				.Join(
					_dbContext.Choice,
					vote => vote.Poll,
					choice => choice.Poll,
					(vote, choice) => new { vote, choice }
				)
				.GroupBy(vc => vc.choice.Description)
				.Select(grouped => new
				{
					Description = grouped.Key,
					VoteCount = grouped.Count()
				})
				.ToDictionaryAsync(x => x.Description, x => x.VoteCount);

			var years = _dbContext.PollYear.Where(y => y.PollId == pollId).ToArray();
			var info = new PollOverview()
			{
				Id = poll.Id,
				Headline = poll.Headline,
				Description = poll.Description,
				Votes = dict,
				Year = _dbContext.PollYear.Where(y => y.PollId == pollId).Select(y => (int)y.Year).ToArray(),
				Branch = _dbContext.PollBranch.Where(b => b.PollId == pollId).Select(b => b.Branch).ToArray(),
			};

			return Ok(info);
		}
	}
}
