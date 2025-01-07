using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using Leoweb.Server.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async  Task<Student> GetStudentById(string id)
    {
        return await _context.Student.FirstOrDefaultAsync(s => s.Id == id);
    }
    
    public async Task RegisterStudentAsync(string email, string password)
    {
        var student = new Student
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            PasswordHash = HashPassword(password)
        };

        _context.Student.Add(student);
        await _context.SaveChangesAsync();
    }
    
    public string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashBytes);
        }
    }
}