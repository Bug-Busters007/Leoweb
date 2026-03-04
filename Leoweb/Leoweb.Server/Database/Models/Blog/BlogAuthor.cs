using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace Leoweb.Server.Database.Models.Blog;

// ═══════════════════════════════════════════════════════════
// EXTENDED REFERENCE PATTERN
// (https://www.mongodb.com/company/blog/building-with-patterns-the-extended-reference-pattern)
//
// Die Author-Daten (userId, username, firstname, lastname) werden
// als embedded Subdocument im BlogEntry gespeichert, anstatt nur
// eine userId-Referenz zu halten. Das eliminiert die Notwendigkeit
// für einen $lookup/JOIN beim Lesen von Blog-Einträgen.
//
// Trade-off: Bei Namensänderungen müssen alle Einträge des Users
// aktualisiert werden (Denormalisierung). Lese-Performance > Schreib-Performance.
// ═══════════════════════════════════════════════════════════
public class BlogAuthor
{
    [BsonElement("userId")]
    [JsonPropertyName("userId")]
    public string UserId { get; set; } = null!;

    [BsonElement("username")]
    [JsonPropertyName("username")]
    public string Username { get; set; } = null!;

    [BsonElement("firstname")]
    [JsonPropertyName("firstname")]
    public string Firstname { get; set; } = null!;

    [BsonElement("lastname")]
    [JsonPropertyName("lastname")]
    public string Lastname { get; set; } = null!;
}

