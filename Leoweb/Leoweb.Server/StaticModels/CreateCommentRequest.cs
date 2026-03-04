using System.Text.Json.Serialization;

namespace Leoweb.Server.StaticModels;

public class CreateCommentRequest
{
    [JsonPropertyName("text")]
    public string Text { get; set; } = null!;
}

