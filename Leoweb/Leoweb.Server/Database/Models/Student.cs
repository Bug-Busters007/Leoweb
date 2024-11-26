using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Database.Models
{
    public class Student
    {
        [Key]
        public string Id { get; set; } = string.Empty;
    }
}
