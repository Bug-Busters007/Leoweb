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
			var dict = await _dbContext.Vote
				.Join(
					_dbContext.Choice,
					vote => vote.PollId,
					choice => choice.PollId,
					(vote, choice) => new { vote, choice }
				)
				.Where(vc => vc.vote.Poll.Id == pollId)
				.GroupBy(vc => vc.choice.Description)
				.Select(grouped => new
				{
					Description = grouped.Key,
					VoteCount = grouped.Where(x => x.vote.ChoiceId == x.choice.Id).Count()
				})
			.ToDictionaryAsync(x => x.Description, x => x.VoteCount);

			var years = _dbContext.PollYear.Where(y => y.PollId == pollId).ToArray();
			return new PollOverview()
			{
				Id = poll.Id,
				Headline = poll.Headline,
				Description = poll.Description,
				Release = poll.Release.ToLongDateString(),
				Close = poll.Close.HasValue ? poll.Close.Value.ToLongDateString() : string.Empty,
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
					(x, poll) => new { poll.Id, poll.Headline, poll.Description, ChoiceDescription = x.choice.Description, x.vote }
				)
				.ToListAsync();

			var pollGrouped = pollChoices
				.GroupBy(x => new { x.Id, x.Headline, x.Description })
				.Select(grouped => new
				{
					PollId = grouped.Key.Id,
					Headline = grouped.Key.Headline,
					PollDescription = grouped.Key.Description,
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
				.Select(p => new PollOverview
				{
					Id = p.PollId,
					Headline = p.Headline,
					Description = p.PollDescription,
					Votes = p.Votes,
					Year = pollYears.ContainsKey(p.PollId) ? pollYears[p.PollId] : Array.Empty<int>(),
					Branch = pollBranches.ContainsKey(p.PollId) ? pollBranches[p.PollId] : Array.Empty<string>(),
				})
				.ToArray();
		}
	}
}
