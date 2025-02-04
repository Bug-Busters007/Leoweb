using Leoweb.Server.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Database.Data;

public class ChatDbContext : DbContext
{
    public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options) { }

    public DbSet<ChatMessage> ChatMessages { get; set; }
}