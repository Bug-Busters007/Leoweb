using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
	public class PollYear
	{
		[Key]
		public int Id { get; set; }
		[ForeignKey(nameof(Poll))]
		public int PollId { get; set; }
		public Year Year { get; set; }

		public Poll Poll { get; set; }
	}
}
