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
					.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
					.Build();

				string apiUrl = configuration["ApiSettings:BaseUrl"] + "/api/auth/userdata";
				client.BaseAddress = new Uri(apiUrl);
				var response = await client.GetAsync(apiUrl);
				if (response.IsSuccessStatusCode)
				{
					return await response.Content.ReadFromJsonAsync<Student>();
				}
			}
			return new Student();
		}
	}
}
