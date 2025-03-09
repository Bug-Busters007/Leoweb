using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Leoweb.Server.Database.Models;

public class UserFileLike
{
    [Key]
    public int Id { get; set; }
        
    [Required]
    public string UserId { get; set; }
        
    [Required]
    public int FileId { get; set; }
        
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("UserId")]
    public virtual Student Student { get; set; }
        
    [ForeignKey("FileId")]
    public virtual File File { get; set; }
}