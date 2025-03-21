using System.ComponentModel.DataAnnotations;
using Leoweb.Server.Database.Data;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Controllers
{
    
    
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly ApplicationDbContext _dbContext;

        public ChatController(ChatDbContext context)
        {
            _context = context;
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().Options;
            _dbContext = new ApplicationDbContext(options);
        }

        [HttpGet("messages")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetMessages()
        {
            var messages = await _context.ChatMessages
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
            return Ok(messages);
        }

        [HttpGet("{id}/email")]
        public IActionResult GetStudentName([FromRoute] string id)
        {
            var student = _dbContext.Student.Find(id);
            if (student == null)
            {
                return NotFound();
            }
            
            return Ok(new { email = student.Email });
        }
        
        
        [HttpDelete("messages/{id}")]
        public async Task<ActionResult<ChatMessage>> DeleteMessages(int id)
        {
            bool success = false;
            try
            {
                var file = _context.ChatMessages.Find(id);
          
                if (file == null)
                {
                    throw new Exception($"File with ID {id} not found.");
                }
          
                _context.ChatMessages.Remove(file);
          
                int affectedRows = _context.SaveChanges();
          
                success = affectedRows > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting message with ID {id}: {ex.Message}");
            }
            if (success)
            {
                return NoContent();
            }
            else
            {
                return NotFound($"Message with ID {id} not found");
            }
        }
    }
}