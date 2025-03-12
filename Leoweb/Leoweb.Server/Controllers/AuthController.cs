using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Leoweb.Server.Database.Models;
using Leoweb.Server.Services;
using Leoweb.Server.StaticModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
            bool success = await _authService.RegisterStudentAsync(model.Email, model.Password, model.Role);
            return success ? Ok() : Problem();
        }
        catch (Exception e)
        {
            return BadRequest($"Registration failed {e.Message}");
        }
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto loginDto)
    {
        var user = await _authService.IsValidUser(loginDto.Email, loginDto.Password);
        if(user == null)
        {
            return Unauthorized();
        }
        
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, loginDto.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, loginDto.Email),
            new Claim("Role", user.Role.ToString()),
            new Claim("UserId", user.Id.ToString())
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );
        
        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo,
            username = loginDto.Email
        });
    }
    
    [HttpGet("getUserData")]
    public IActionResult GetUserData()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        var role = User.Claims.FirstOrDefault(c => c.Type == "Role")?.Value;
        Console.WriteLine(email);
        Console.WriteLine(userId);
        Console.WriteLine(role);
        
        if (email == null || userId == null || role == null)
        {
            return Unauthorized("Ungültiges Token");
        }
        
        return Ok(new
        {
            Email = email,
            Role = role,
            UserId = userId
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
    
    [HttpPatch("changePassword")]
    public async Task<IActionResult> ChangePassword(ChangePasswordUser usermodel)
    {
        try
        {
            bool success = await _authService.ChangePassword(usermodel.Email, usermodel.OldPassword, usermodel.NewPassword);
            return success ? Ok() : Problem();
        }
        catch (Exception)
        {
            return BadRequest("Changing password failed");
        }
    }

    [HttpPatch("changeEmail")]
    public async Task<IActionResult> ChangeEmail(ChangeEmailUser usermodel)
    {
        try
        {
            bool success = await _authService.ChangeEmail(usermodel.OldEmail, usermodel.NewEmail, usermodel.Password);
            return success ? Ok() : Problem();
        }
        catch (Exception)
        {
            return BadRequest("Changing email failed");
        }
    }
}