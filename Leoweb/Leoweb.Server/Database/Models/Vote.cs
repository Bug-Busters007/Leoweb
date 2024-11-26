using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
    public class Vote
    {
        [Key]
        [Column(Order = 1)]
        public required Student Student { get; set; }
        [Key]
        [Column(Order = 2)]
        public required string Choice { get; set; } = string.Empty;
    }
}
