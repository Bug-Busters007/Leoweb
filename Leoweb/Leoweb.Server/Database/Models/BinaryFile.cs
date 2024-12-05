using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Database.Models
{
	public class BinaryFile
	{
		[Key]
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public byte[] Data { get; set; } = null!;
	}
}
