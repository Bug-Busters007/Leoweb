using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Database.Models
{
    public class Student
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string SessionToken { get; set; } = null!;
    }
}
