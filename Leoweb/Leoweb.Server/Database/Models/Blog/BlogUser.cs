using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Leoweb.Server.Database.Models.Blog;

/// <summary>
/// Blog-User wird in MongoDB gespeichert (eigene Users-Collection).
/// Wird beim Extended Reference Pattern verwendet, um Author-Daten
/// in BlogEntry embedded zu speichern.
/// </summary>
public class BlogUser
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string Id { get; set; } = null!;

    [BsonElement("username")]
    [JsonPropertyName("username")]
    public string Username { get; set; } = null!;

    [BsonElement("firstname")]
    [JsonPropertyName("firstname")]
    public string Firstname { get; set; } = null!;

    [BsonElement("lastname")]
    [JsonPropertyName("lastname")]
    public string Lastname { get; set; } = null!;

    [BsonElement("email")]
    [JsonPropertyName("email")]
    public string Email { get; set; } = null!;

    [BsonElement("password")]
    [JsonPropertyName("password")]
    public string Password { get; set; } = null!;
}

