using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Controllers.Database.Models
{
	public class Votes
	{
		[Key]
		public required Student Student { get; set; }
		[Key]
		public required Poll PollId { get; set; }
		public required string Vote { get; set; } = string.Empty;
	}
}
