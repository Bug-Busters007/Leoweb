using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Leoweb.Server.Database.Models.Blog;

public class BlogComment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string Id { get; set; } = null!;

    [BsonElement("entryId")]
    [JsonPropertyName("entryId")]
    public string EntryId { get; set; } = null!;

    [BsonElement("author")]
    [JsonPropertyName("author")]
    public string Author { get; set; } = null!;

    [BsonElement("username")]
    [JsonPropertyName("username")]
    public string Username { get; set; } = null!;

    [BsonElement("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = null!;

    [BsonElement("createdAt")]
    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = null!;
}

