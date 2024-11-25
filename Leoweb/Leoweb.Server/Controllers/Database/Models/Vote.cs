namespace Leoweb.Server.Controllers.Database.Models
{
	public class Votes
	{
        public required Student Student { get; set; }
        public required string Vote { get; set; } = string.Empty;
        public required Poll PollId { get; set; }
    }
}
