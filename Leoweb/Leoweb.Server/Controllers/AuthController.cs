using Leoweb.Server.Database.Models;
using Leoweb.Server.Services;
using Leoweb.Server.StaticModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly AuthService _authService;

    public AuthController(AuthService authService, ApplicationDbContext context)
    {
        _authService = authService;
        _context = context;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        try
        {
            await _authService.RegisterStudentAsync(model.Email, model.Password);
            return Ok("User registered successfully");
        }
        catch (Exception)
        {
            return BadRequest("Registration failed");
        }
    }

    // Login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _context.Students.FirstOrDefaultAsync(u => u.Email == model.Email);
        if (user == null || _authService.HashPassword(model.Password) != user.PasswordHash)
        {
            return Unauthorized(new { message = "Ungültige Anmeldedaten" });
        }
        
        var sessionToken = Guid.NewGuid().ToString();
        
        user.SessionToken = sessionToken;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            name = user.Email.Substring(0, user.Email.IndexOf('@')), 
            token = sessionToken
        });
    }
}