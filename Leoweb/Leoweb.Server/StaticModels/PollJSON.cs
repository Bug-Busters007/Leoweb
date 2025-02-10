

using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Leoweb.Server.StaticModels
{
	public class PollJSON
	{
		public string Headline { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public DateTime Release { get; set; }
		public DateTime? Close { get; set; }
		public string[] Choices { get; set; } = Array.Empty<string>();
		public int[] Year { get; set; }
		public string[] Branch { get; set; }
	}
}
