using Leoweb.Server.Database.Data;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leoweb.Server.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public ChatController(ChatDbContext context)
        {
            _context = context;
        }

        [HttpGet("messages")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetMessages()
        {
            var messages = await _context.ChatMessages
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
            return Ok(messages);
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