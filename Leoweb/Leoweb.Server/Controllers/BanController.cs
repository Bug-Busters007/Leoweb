using Leoweb.Server.Database.Data;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Leoweb.Server.Services;

namespace Leoweb.Server.Controllers
{
    [Route("api/ban")]
    [ApiController]
    public class BanController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BanController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("allBans")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetAllBans()
        {
            var messages = await _context.StudentBan
                .ToListAsync();
            return Ok(messages);
        }

        [HttpPost("")]
        public async Task<ActionResult<StudentBan>> AddBan([FromBody]StudentBan studentBan)
        {
            if (studentBan == null)
            {
                return BadRequest("Student ban information cannot be null.");
            }
            
            
            string[] validBannedInValues = { "chat", "library", "poll" };
            if (!validBannedInValues.Contains(studentBan.BannedIn?.ToLower()))
            {
                return BadRequest("BannedIn must be one of the following values: chat, library, poll.");
            }

            var authService = new AuthService(_context);
            if (await authService.StudentExists(studentBan.StudentId))
            {
                return NotFound($"Student with ID {studentBan.StudentId} not found.");
            }

            var ban = new StudentBan()
            {
                BannedIn = studentBan.BannedIn,
                StudentId = studentBan.StudentId,
                Reason = studentBan.Reason,
            };
    
            _context.StudentBan.Add(ban);
    
            await _context.SaveChangesAsync();

            return Ok(ban);
        }
    }
}