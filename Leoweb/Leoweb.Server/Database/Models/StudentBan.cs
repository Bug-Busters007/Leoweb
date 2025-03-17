using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Database.Models
{
    public class StudentBan
    {
        [Key]
        public string Id { get; set; }
        public string Reason { get; set; }
        public string BannedIn { get; set; }
        [ForeignKey(nameof(Student))]
        public string StudentId { get; set; }
    }
}