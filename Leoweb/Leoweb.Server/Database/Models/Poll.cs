using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
    public class Poll
    {
        [Key]
        public int Id { get; set; }
        public string Headline { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
        public DateTime Created { get; set; }
        public DateTime Release { get; set; }
        public DateTime? Close { get; set; }
		[ForeignKey(nameof(Student))]
		public required string StudentId { get; set; }
		public Student Student { get; set; }
	}
}
