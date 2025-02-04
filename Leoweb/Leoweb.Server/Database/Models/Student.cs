using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Database.Models
{
    public class Student
    {
        [Key]
        public string Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
		public int Year { get; set; }
		public string Branch { get; set; }
	}
}
