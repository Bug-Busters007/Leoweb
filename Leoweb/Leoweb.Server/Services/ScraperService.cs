namespace Leoweb.Server.Services;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Dom;

public class ScraperService
{
    private readonly HttpClient _httpClient;
    private const string Url = "https://htl-leonding.at/schueler-innen/organisation/termine/";

    public ScraperService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<EventData>> ScrapeEventsAsync()
    {
        var events = new List<EventData>();
        var response = await _httpClient.GetStringAsync(Url);

        var config = Configuration.Default.WithDefaultLoader();
        var context = BrowsingContext.New(config);
        var document = await context.OpenAsync(req => req.Content(response));

        foreach (var row in document.QuerySelectorAll("table tr"))
        {
            var cells = row.QuerySelectorAll("td");
            if (cells.Length == 4)
            {
                events.Add(new EventData
                {
                    Date = cells[0].TextContent.Trim(),
                    Time = cells[1].TextContent.Trim(),
                    Event = cells[2].TextContent.Trim(),
                    Location = cells[3].TextContent.Trim()
                });
            }
        }
        return events;
    }
}

public class EventData
{
    public string Date { get; set; }
    public string Time { get; set; }
    public string Event { get; set; }
    public string Location { get; set; }
}