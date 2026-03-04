using System.Text.Json.Serialization;
using Leoweb.Server.Database.Models.Blog;

namespace Leoweb.Server.StaticModels;

public class CreateBlogEntryRequest
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = null!;

    [JsonPropertyName("description")]
    public string Description { get; set; } = null!;

    [JsonPropertyName("category")]
    public string Category { get; set; } = null!;

    [JsonPropertyName("content")]
    public BlogContent Content { get; set; } = null!;

    [JsonPropertyName("commentsAllowed")]
    public bool CommentsAllowed { get; set; }
}

