namespace Leoweb.Server.Database.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public string StudentName { get; set; }
    public string Message { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}