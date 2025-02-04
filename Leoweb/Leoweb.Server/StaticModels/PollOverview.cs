namespace Leoweb.Server.StaticModels
{
	public class PollOverview
	{
		public int Id { get; set; }
		public string Headline { get; set; }
		public string Description { get; set; }
		public Dictionary<string, int> Votes { get; set; }
	}
}
