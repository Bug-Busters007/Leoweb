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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetMessages()
        {
            var messages = await _context.ChatMessages
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
            return Ok(messages);
        }
    }
}