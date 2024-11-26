using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Database.Models
{
    public class Poll
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public Vote Votes { get; set; } = null!;
    }
}
