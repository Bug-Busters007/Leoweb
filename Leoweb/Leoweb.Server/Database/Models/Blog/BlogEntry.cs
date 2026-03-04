using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Leoweb.Server.Database.Models.Blog;

public class BlogEntry
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string Id { get; set; } = null!;

    [BsonElement("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = null!;

    // ═══════════════════════════════════════════════════════════
    // EXTENDED REFERENCE PATTERN
    // Die Author-Daten werden als embedded Subdocument gespeichert.
    // Kein $lookup nötig beim Lesen von Blog-Einträgen.
    // ═══════════════════════════════════════════════════════════
    [BsonElement("author")]
    [JsonPropertyName("author")]
    public BlogAuthor Author { get; set; } = null!;

    [BsonElement("description")]
    [JsonPropertyName("description")]
    public string Description { get; set; } = null!;

    [BsonElement("category")]
    [JsonPropertyName("category")]
    public string Category { get; set; } = null!;

    [BsonElement("creationDate")]
    [JsonPropertyName("creationDate")]
    public string CreationDate { get; set; } = null!;

    [BsonElement("editDates")]
    [JsonPropertyName("editDates")]
    public List<string> EditDates { get; set; } = new();

    // ═══════════════════════════════════════════════════════════
    // COMPUTED PATTERN
    // (https://www.mongodb.com/company/blog/building-with-patterns-the-computed-pattern)
    //
    // Der ImpressionCount wird als vorberechneter Wert direkt im
    // Dokument gespeichert und mit der atomaren $inc-Operation
    // aktualisiert. Kein Read-Modify-Write, kein count() über
    // eine separate Impressions-Collection.
    // ═══════════════════════════════════════════════════════════
    [BsonElement("impressionCount")]
    [JsonPropertyName("impressionCount")]
    public long ImpressionCount { get; set; }

    [BsonElement("content")]
    [JsonPropertyName("content")]
    public BlogContent Content { get; set; } = null!;

    [BsonElement("commentsAllowed")]
    [JsonPropertyName("commentsAllowed")]
    public bool CommentsAllowed { get; set; }
}

