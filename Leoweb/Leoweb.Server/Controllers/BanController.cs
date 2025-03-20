using Leoweb.Server.Database.Data;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Leoweb.Server.Services;
using Leoweb.Server.StaticModels;

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
        
        [HttpPost("{studentId}")]
        public async Task<ActionResult<StudentBan>> AddBan([FromBody] AddBan addBan, string studentId)
        {
            string[] validBannedInValues = { "chat", "library", "poll" };
            if (!validBannedInValues.Contains(addBan.BannedIn.ToLower()))
            {
                return BadRequest("BannedIn must be one of the following values: chat, library, poll.");
            }

            var ban = new StudentBan()
            {
                BannedIn = addBan.BannedIn,
                StudentId = studentId,
                Reason = addBan.Reason,
            };
    
            _context.StudentBan.Add(ban);
    
            await _context.SaveChangesAsync();

            return Ok(ban);
        }
    }
}