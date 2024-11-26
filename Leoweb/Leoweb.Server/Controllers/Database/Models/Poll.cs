using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Controllers.Database.Models
{
	public class Poll
	{
		[Key]
		public int Id { get; set; }
		public string Description { get; set; } = string.Empty;
    }
}
