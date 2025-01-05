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
				var configuration = new ConfigurationBuilder()
					.AddJsonFile("appsettings.json")
					.Build();

				string apiUrl = string.Join(configuration["ApiSettings:BaseUrl"], "api/auth/");
				client.BaseAddress = new Uri(apiUrl);
				var response = await client.GetAsync("userdata");
				if (response.IsSuccessStatusCode)
				{
					return await response.Content.ReadFromJsonAsync<Student>();
				}
			}
			return new Student();
		}
	}
}
