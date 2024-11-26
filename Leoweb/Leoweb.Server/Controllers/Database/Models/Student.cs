using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Controllers.Database.Models
{
	public class Student
	{
		[Key]
		public string Id { get; set; } = string.Empty;	
    }
}
