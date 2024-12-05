using System.ComponentModel.DataAnnotations;

namespace Leoweb.Server.Database.Models
{
	public class BinaryFile
	{
		[Key]
		public int Id { get; set; }
		public byte[] Data { get; set; }
	}
}
