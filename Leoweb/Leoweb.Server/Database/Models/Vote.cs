using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
    public class Vote
    {
		[Key]
		public int Id { get; set; }
<<<<<<< HEAD
        [ForeignKey(nameof(Student))]
        public string StudentId { get; set; }
        [ForeignKey(nameof(Poll))]
        public int PollId { get; set; }
        [ForeignKey(nameof(Choice))]
=======
		[ForeignKey(nameof(Student))]
		public string StudentId { get; set; }
		[ForeignKey(nameof(Poll))]
		public int PollId { get; set; }
		[ForeignKey(nameof(Choice))]
>>>>>>> origin/main
		public int ChoiceId { get; set; }

		public Student Student { get; set; }
		public Poll Poll { get; set; }
<<<<<<< HEAD
        public Choice Choice { get; set; }
=======
		public Choice Choice { get; set; }
>>>>>>> origin/main
	}
}
