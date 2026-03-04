using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace Leoweb.Server.Database.Models.Blog;

public class BlogContent
{
    [BsonElement("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = null!;

    [BsonElement("links")]
    [JsonPropertyName("links")]
    public List<string> Links { get; set; } = new();

    [BsonElement("images")]
    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();

    // Zusätzliches Feld: Tags für die Blog-Inhalts-Kategorisierung
    [BsonElement("tags")]
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();
}

