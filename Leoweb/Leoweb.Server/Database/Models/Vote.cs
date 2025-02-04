using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
    public class Vote
    {
        [Key]
		public int Id { get; set; }
        public required Student Student { get; set; }
        public Poll Poll { get; set; } = null!;
		public required string Choice { get; set; } = string.Empty;
    }
}
