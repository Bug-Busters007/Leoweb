using Leoweb.Server.Database.Data;
using Leoweb.Server.Database.Models;
using Microsoft.AspNetCore.SignalR;

namespace Leoweb.Server.Services;

public class ChatHub : Hub
{
    private readonly ChatDbContext _context;

    public ChatHub(ChatDbContext context)
    {
        _context = context;
    }

    public async Task SendMessage(string student, string message)
    {
        var chatMessage = new ChatMessage { StudentName = student, Message = message };
        _context.ChatMessages.Add(chatMessage);
        await _context.SaveChangesAsync();

        await Clients.All.SendAsync("ReceiveMessage", student, message);
    }
}