using Leoweb.Server.Database.Models;
using Leoweb.Server.StaticModels;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Leoweb.Server.Services
{
	public class PollService
	{
		private readonly ApplicationDbContext _dbContext;


		public PollService (ApplicationDbContext context)
		{
			_dbContext = context;
		}

		public async Task<PollOverview> GetPollOverview(int pollId, Poll poll)
		{
			var dict = await _dbContext.Choice
				.Where(c => c.PollId == pollId)
				.GroupJoin(
					_dbContext.Vote,
					choice => choice.PollId,
					vote => vote.PollId,
					(choice, vote) => new { choice, vote }
				)
				.SelectMany(
					x => x.vote.DefaultIfEmpty(),
					(choiceGroup, vote) => new { choiceGroup.choice, vote }
				)
				.GroupBy(vc => vc.choice.Description)
				.Select(grouped => new
				{
					Description = grouped.Key,
					VoteCount = grouped.Where(x => x.vote.ChoiceId == x.choice.Id).Count()
				})
			.ToDictionaryAsync(x => x.Description, x => x.VoteCount);

			return new PollOverview()
			{
				Id = poll.Id,
				Headline = poll.Headline,
				Description = poll.Description,
				Creator = poll.StudentId,
				Release = poll.Release.ToString("M/d/yyyy HH:mm:ss"),
				Close = poll.Close.HasValue ? poll.Close.Value.ToString("M/d/yyyy HH:mm:ss") : string.Empty,
				Votes = dict,
				Year = _dbContext.PollYear.Where(y => y.PollId == pollId).Select(y => (int)y.Year).ToArray(),
				Branch = _dbContext.PollBranch.Where(b => b.PollId == pollId).Select(b => b.Branch).ToArray(),
			};
		}

		public async Task<PollOverview[]> GetAllPolls()
		{
			var pollChoices = await _dbContext.Choice
				.GroupJoin(
					_dbContext.Vote,
					choice => choice.Id,
					vote => vote.ChoiceId,
					(choice, votes) => new { choice, votes }
				)
				.SelectMany(
					x => x.votes.DefaultIfEmpty(),
					(x, vote) => new { x.choice, vote }
				)
				.Join(
					_dbContext.Poll,
					x => x.choice.PollId,
					poll => poll.Id,
					(x, poll) => new { poll.Id, poll.Headline, poll.Description, poll.StudentId, ChoiceDescription = x.choice.Description, poll.Release, poll.Close, x.vote }
				)
				.ToListAsync();

			var pollGrouped = pollChoices
				.GroupBy(x => new { x.Id, x.Headline, x.Description, x.StudentId })
				.Select(grouped => new
				{
					PollId = grouped.Key.Id,
					Headline = grouped.Key.Headline,
					PollDescription = grouped.Key.Description,
					Creator = grouped.Key.StudentId,
					Votes = grouped
						.GroupBy(c => c.ChoiceDescription)
						.ToDictionary(
							g => g.Key,
							g => g.Count(x => x.vote != null)
						)
				})
				.ToList();

			var pollYears = _dbContext.PollYear
				.GroupBy(y => y.PollId)
				.ToDictionary(g => g.Key, g => g.Select(y => (int)y.Year).ToArray());

			var pollBranches = _dbContext.PollBranch
				.GroupBy(b => b.PollId)
				.ToDictionary(g => g.Key, g => g.Select(b => b.Branch).ToArray());

			return pollGrouped
				.Select(p =>
				{
					var poll = _dbContext.Poll.Find(p.PollId);
					return new PollOverview
					{
						Id = p.PollId,
						Headline = p.Headline,
						Description = p.PollDescription,
						Creator = p.Creator,
						Release = poll?.Release.ToString("M/d/yyyy HH:mm:ss") ?? string.Empty,
						Close = poll?.Close.HasValue == true ? poll.Close.Value.ToString("M/d/yyyy HH:mm:ss") : string.Empty,
						Votes = p.Votes,
						Year = pollYears.TryGetValue(p.PollId, out var years) ? years : Array.Empty<int>(),
						Branch = pollBranches.TryGetValue(p.PollId, out var branches) ? branches : Array.Empty<string>(),
					};
				})
				.ToArray();
	}
	}
}
