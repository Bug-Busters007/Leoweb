using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Database.Models
{
	public class Choice
	{
		[Key]
		public int Id { get; set; }
		public Poll Poll { get; set; } = null!;
		public string Description { get; set; } = string.Empty;
	}
}
