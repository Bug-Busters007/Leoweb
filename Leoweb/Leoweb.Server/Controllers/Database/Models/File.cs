namespace Leoweb.Server.Controllers.Database.Models
{
    public class File
    {
        public int Id { get; set; }
        public Subject Subject { get; set; }
        public required string Content { get; set; }
        public DateOnly Date { get; set; }
        public required Student Student { get; set; }
    }
}
