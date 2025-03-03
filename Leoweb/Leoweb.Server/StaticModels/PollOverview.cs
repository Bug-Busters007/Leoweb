using System.Text.Json.Serialization;

namespace Leoweb.Server.StaticModels
{
	public class PollOverview
	{
		public int Id { get; set; }
		public string Headline { get; set; }
		public string Description { get; set; }
		public string Release { get; set; }
		public string Close { get; set; }
		public Dictionary<string, int> Votes { get; set; }
		public int[] Year { get; set; }
		public string[] Branch { get; set; }
	}
}
