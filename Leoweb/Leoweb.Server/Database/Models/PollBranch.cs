using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
	public class PollBranch
	{
		[Key]
		public int Id { get; set; }
		[ForeignKey(nameof(Poll))]
		public int PollId { get; set; }
		public string Branch { get; set; }

		public Poll Poll { get; set; }
	}
}
