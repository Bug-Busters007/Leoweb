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
    private readonly SessionService _sessionService;

    public AuthController(AuthService authService, ApplicationDbContext context, SessionService sessionService)
    {
        _authService = authService;
        _context = context;
        _sessionService = sessionService;
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
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _context.Students.FirstOrDefaultAsync(u => u.Email == model.Email);
        if (user == null || _authService.HashPassword(model.Password) != user.PasswordHash)
        {
            return Unauthorized(new { message = "Ungültige Anmeldedaten" });
        }

        var sessionToken = Guid.NewGuid().ToString();
        Console.WriteLine(sessionToken);
        _sessionService.SaveSession(user.Id, sessionToken);
        Response.Cookies.Append("SessionToken", sessionToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // HTTPS ====>>>>>> TRUE
            SameSite = SameSiteMode.Strict
        });
        await _context.SaveChangesAsync();

        return Ok();
    }
    
    [HttpGet("userdata")]
    public async Task<IActionResult> GetUserData()
    {
        var sessionToken = Request.Cookies["SessionToken"];
        Console.WriteLine(sessionToken);
        Console.WriteLine(string.IsNullOrEmpty(sessionToken) );
        Console.WriteLine(_sessionService.IsValidSession(sessionToken));
        Console.WriteLine(_sessionService.GetUserFromSession(sessionToken));
        if (string.IsNullOrEmpty(sessionToken) || !_sessionService.IsValidSession(sessionToken))
        {
            return Unauthorized();
        }

        var userId = _sessionService.GetUserFromSession(sessionToken);
        var user = await _authService.GetStudentById(userId);

        return Ok(user);
    }
    
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var sessionToken = Request.Cookies["SessionToken"];
        if (!string.IsNullOrEmpty(sessionToken))
        {
            _sessionService.RemoveSession(sessionToken);
        }
        
        Response.Cookies.Delete("SessionToken");

        return Ok();
    }
}