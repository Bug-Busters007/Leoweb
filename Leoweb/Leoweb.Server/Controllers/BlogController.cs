using System.Security.Claims;
using Leoweb.Server.Database.Models.Blog;
using Leoweb.Server.Services;
using Leoweb.Server.StaticModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Leoweb.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    // ════════════════════════════════════════
    //  Helper: User-Daten aus JWT-Token
    // ════════════════════════════════════════

    private string GetUserId() =>
        User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value ?? "";

    private string GetUserEmail() =>
        User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "";

    private string GetUserRole() =>
        User.Claims.FirstOrDefault(c => c.Type == "Role")?.Value ?? "";

    private bool IsAdmin() => GetUserRole().Equals("admin", StringComparison.OrdinalIgnoreCase);

    // ════════════════════════════════════════
    //  USER-REGISTRIERUNG
    // ════════════════════════════════════════

    /// <summary>
    /// POST api/Blog/register – Blog-User automatisch aus JWT-Token anlegen.
    /// Wird beim Öffnen der Blog-Seite aufgerufen.
    /// Falls der User schon existiert → 409 Conflict.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> RegisterBlogUser()
    {
        var email = GetUserEmail();
        if (string.IsNullOrEmpty(email))
            return BadRequest("Keine Email im Token gefunden");

        // Prüfen ob der User schon existiert
        var existingUser = await _blogService.GetBlogUserByEmailAsync(email);
        if (existingUser != null)
            return Conflict("Blog-User existiert bereits");

        // User-Daten aus dem JWT-Token holen und Blog-User anlegen
        var newBlogUser = new BlogUser
        {
            Username = email.Split('@')[0],
            Email = email,
            Firstname = email.Split('@')[0],
            Lastname = "",
            Password = ""  // wird nicht gebraucht, Auth läuft über JWT
        };

        var created = await _blogService.CreateBlogUserAsync(newBlogUser);
        return Ok(created);
    }

    // ════════════════════════════════════════
    //  ENTRIES
    // ════════════════════════════════════════

    /// <summary>
    /// GET api/Blog/all – Alle Blog-Einträge (sortiert nach creationDate desc)
    /// </summary>
    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BlogEntry>>> GetAll()
    {
        var entries = await _blogService.GetAllEntriesAsync();
        return Ok(entries);
    }

    /// <summary>
    /// GET api/Blog/{id} – Einzelnen Blog-Eintrag per ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<BlogEntry>> GetById(string id)
    {
        var entry = await _blogService.GetEntryByIdAsync(id);
        if (entry == null) return NotFound();
        return Ok(entry);
    }

    /// <summary>
    /// GET api/Blog/category/{category} – Einträge nach Kategorie filtern
    /// </summary>
    [HttpGet("category/{category}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BlogEntry>>> GetByCategory(string category)
    {
        var entries = await _blogService.GetEntriesByCategoryAsync(category);
        return Ok(entries);
    }

    /// <summary>
    /// GET api/Blog/categories – Alle verfügbaren Kategorien
    /// </summary>
    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BlogCategory>>> GetCategories()
    {
        var categories = await _blogService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    /// <summary>
    /// POST api/Blog – Neuen Blog-Eintrag erstellen.
    /// 
    /// ═══════════════════════════════════════════════════════════
    /// EXTENDED REFERENCE PATTERN
    /// Author-Daten (userId, username, firstname, lastname) werden aus der
    /// BlogUsers-Collection geholt und als embedded Subdocument im BlogEntry
    /// gespeichert. Kein $lookup beim Lesen nötig.
    /// ═══════════════════════════════════════════════════════════
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<BlogEntry>> Create([FromBody] CreateBlogEntryRequest request)
    {
        var userId = GetUserId();
        var email = GetUserEmail();

        // Extended Reference Pattern: User-Daten aus MongoDB holen
        // Zuerst nach Email suchen (JWT liefert GUID als UserId, kein ObjectId)
        var blogUser = await _blogService.GetBlogUserByEmailAsync(email);
        if (blogUser == null)
        {
            // Fallback: Suche nach ID (falls die UserId ein gültiger ObjectId ist)
            blogUser = await _blogService.GetBlogUserByIdAsync(userId);
        }

        if (blogUser == null)
        {
            return BadRequest("Blog-User nicht gefunden. Bitte zuerst einen Blog-User anlegen.");
        }

        var entry = new BlogEntry
        {
            Title = request.Title,
            // Extended Reference: Kopie der User-Daten embedded im Entry
            Author = new BlogAuthor
            {
                UserId = blogUser.Id,
                Username = blogUser.Username,
                Firstname = blogUser.Firstname,
                Lastname = blogUser.Lastname
            },
            Description = request.Description,
            Category = request.Category,
            CreationDate = DateTime.UtcNow.ToString("o"),
            EditDates = new List<string>(),
            ImpressionCount = 0, // Computed Pattern: Start bei 0
            Content = request.Content,
            CommentsAllowed = request.CommentsAllowed
        };

        var created = await _blogService.CreateEntryAsync(entry);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// PUT api/Blog/{id} – Blog-Eintrag aktualisieren. Nur Autor oder Admin.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<BlogEntry>> Update(string id, [FromBody] BlogEntry updatedEntry)
    {
        var existing = await _blogService.GetEntryByIdAsync(id);
        if (existing == null) return NotFound();

        var email = GetUserEmail();
        var blogUser = await _blogService.GetBlogUserByEmailAsync(email);
        var resolvedUserId = blogUser?.Id ?? GetUserId();

        if (existing.Author.UserId != resolvedUserId && !IsAdmin())
        {
            return Forbid();
        }

        var result = await _blogService.UpdateEntryAsync(id, updatedEntry);
        if (result == null) return NotFound();
        return Ok(result);
    }

    /// <summary>
    /// DELETE api/Blog/{id} – Blog-Eintrag löschen. Nur Autor oder Admin.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _blogService.GetEntryByIdAsync(id);
        if (existing == null) return NotFound();

        var email = GetUserEmail();
        var blogUser = await _blogService.GetBlogUserByEmailAsync(email);
        var resolvedUserId = blogUser?.Id ?? GetUserId();

        if (existing.Author.UserId != resolvedUserId && !IsAdmin())
        {
            return Forbid();
        }

        await _blogService.DeleteEntryAsync(id);
        return NoContent();
    }

    // ════════════════════════════════════════
    //  COMMENTS
    // ════════════════════════════════════════

    /// <summary>
    /// GET api/Blog/{entryId}/comments – Kommentare eines Eintrags
    /// </summary>
    [HttpGet("{entryId}/comments")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BlogComment>>> GetComments(string entryId)
    {
        var comments = await _blogService.GetCommentsByEntryIdAsync(entryId);
        return Ok(comments);
    }

    /// <summary>
    /// POST api/Blog/{entryId}/comments – Kommentar hinzufügen.
    /// Nur wenn commentsAllowed == true, sonst 403.
    /// </summary>
    [HttpPost("{entryId}/comments")]
    public async Task<ActionResult<BlogComment>> AddComment(string entryId, [FromBody] CreateCommentRequest request)
    {
        var entry = await _blogService.GetEntryByIdAsync(entryId);
        if (entry == null) return NotFound();

        if (!entry.CommentsAllowed)
        {
            return StatusCode(403, "Kommentare sind für diesen Eintrag nicht erlaubt.");
        }

        var userId = GetUserId();
        var email = GetUserEmail();

        // Username aus BlogUser holen (zuerst Email, dann ID)
        var blogUser = await _blogService.GetBlogUserByEmailAsync(email);
        if (blogUser == null)
        {
            blogUser = await _blogService.GetBlogUserByIdAsync(userId);
        }

        var username = blogUser?.Username ?? email;

        var comment = new BlogComment
        {
            EntryId = entryId,
            Author = blogUser?.Id ?? userId,
            Username = username,
            Text = request.Text,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };

        var created = await _blogService.CreateCommentAsync(comment);
        return Created($"api/Blog/{entryId}/comments/{created.Id}", created);
    }

    /// <summary>
    /// DELETE api/Blog/{entryId}/comments/{commentId} – Kommentar löschen. Nur eigener oder Admin.
    /// </summary>
    [HttpDelete("{entryId}/comments/{commentId}")]
    public async Task<IActionResult> DeleteComment(string entryId, string commentId)
    {
        var comment = await _blogService.GetCommentByIdAsync(commentId);
        if (comment == null) return NotFound();

        var userId = GetUserId();
        var email = GetUserEmail();
        // Prüfe ob der User ein BlogUser ist (zuerst Email, dann ID)
        var blogUser = await _blogService.GetBlogUserByEmailAsync(email);
        if (blogUser == null)
        {
            blogUser = await _blogService.GetBlogUserByIdAsync(userId);
        }
        var blogUserId = blogUser?.Id ?? userId;

        if (comment.Author != blogUserId && !IsAdmin())
        {
            return Forbid();
        }

        await _blogService.DeleteCommentAsync(commentId);
        return NoContent();
    }

    // ════════════════════════════════════════
    //  IMPRESSIONS (Computed Pattern)
    // ════════════════════════════════════════

    /// <summary>
    /// POST api/Blog/{entryId}/impression – impressionCount um 1 erhöhen.
    /// 
    /// ═══════════════════════════════════════════════════════════
    /// COMPUTED PATTERN
    /// Verwendet atomare $inc-Operation statt Read-Modify-Write.
    /// ═══════════════════════════════════════════════════════════
    /// </summary>
    [HttpPost("{entryId}/impression")]
    [AllowAnonymous]
    public async Task<IActionResult> IncrementImpression(string entryId)
    {
        await _blogService.IncrementImpressionCountAsync(entryId);
        return NoContent();
    }
}

