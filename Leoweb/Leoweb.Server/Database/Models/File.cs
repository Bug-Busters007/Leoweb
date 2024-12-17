using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Database.Models
{
    public class File
    {
        [Key]
        public int Id { get; set; }
        public Year Year { get; set; }
		public Branch Branch { get; set; }
		public Subject Subject { get; set; }
        public BinaryFile Data { get; set; } = null!;
        public DateOnly Date { get; set; }
        public required Student Student { get; set; }
    }
}
