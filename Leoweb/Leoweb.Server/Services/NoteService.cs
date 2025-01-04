using Leoweb.Server.Database.Models;
using System.Text.RegularExpressions;

namespace Leoweb.Server.Services
{
	public static class NoteService
	{
		public async static Task<Student> GetCurrentStudent()
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri("ht");
				var response = await client.GetAsync("userdata");
				if (response.IsSuccessStatusCode)
				{
					return await response.Content.ReadFromJsonAsync<Student>();
				}
			}
		}

		public static string GetApiBase()
		{
			string filePath = "environment.prod.ts";
			string fileContent = System.IO.File.ReadAllText(filePath);
			string pattern = @"apiUrl:\s*'([^']*)'";
			Match match = Regex.Match(fileContent, pattern);

			if (match.Success)
			{
				return match.Groups[1].Value;
			}
			else
			{
				return string.Empty;
			}
		}
	}
}
