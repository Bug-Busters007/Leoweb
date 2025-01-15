using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Leoweb.Server.Database.Models;
using Leoweb.Server.Services;
using Leoweb.Server.StaticModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Leoweb.Server.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly AuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(AuthService authService, ApplicationDbContext context, IConfiguration configuration)
    {
        _authService = authService;
        _context = context;
        _configuration = configuration;
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
    public async Task<IActionResult> Login(UserLoginDto loginDto)
    {
        if(!await _authService.IsValidUser(loginDto.Email, loginDto.Password))
        {
            return Unauthorized();
        }
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, loginDto.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        // 3. Signaturschlüssel aus der Konfiguration laden
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // 4. Token erstellen
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1), // Token-Laufzeit
            signingCredentials: creds
        );
        
        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo,
            username = loginDto.Email.Substring(0, loginDto.Email.IndexOf('@'))
        });
    }
    
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var sessionToken = Request.Cookies["SessionToken"];
        if (!string.IsNullOrEmpty(sessionToken))
        {
            
        }
        
        Response.Cookies.Delete("SessionToken");

        return Ok();
    }
}