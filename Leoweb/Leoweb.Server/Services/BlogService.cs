using Leoweb.Server.Database.Models.Blog;
using MongoDB.Driver;

namespace Leoweb.Server.Services;

public class BlogService : IBlogService
{
    private readonly IMongoCollection<BlogEntry> _entries;
    private readonly IMongoCollection<BlogComment> _comments;
    private readonly IMongoCollection<BlogCategory> _categories;
    private readonly IMongoCollection<BlogUser> _users;

    public BlogService(IMongoDatabase database)
    {
        _entries = database.GetCollection<BlogEntry>("blogEntries");
        _comments = database.GetCollection<BlogComment>("blogComments");
        _categories = database.GetCollection<BlogCategory>("blogCategories");
        _users = database.GetCollection<BlogUser>("blogUsers");
    }

    // ════════════════════════════════════════
    //  ENTRIES
    // ════════════════════════════════════════

    public async Task<List<BlogEntry>> GetAllEntriesAsync()
    {
        return await _entries.Find(_ => true)
            .SortByDescending(e => e.CreationDate)
            .ToListAsync();
    }

    public async Task<BlogEntry?> GetEntryByIdAsync(string id)
    {
        return await _entries.Find(e => e.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<BlogEntry>> GetEntriesByCategoryAsync(string category)
    {
        return await _entries.Find(e => e.Category == category)
            .SortByDescending(e => e.CreationDate)
            .ToListAsync();
    }

    public async Task<BlogEntry> CreateEntryAsync(BlogEntry entry)
    {
        await _entries.InsertOneAsync(entry);

        // Kategorie automatisch anlegen falls nicht vorhanden
        var existingCategory = await _categories.Find(c => c.Name == entry.Category).FirstOrDefaultAsync();
        if (existingCategory == null)
        {
            await _categories.InsertOneAsync(new BlogCategory { Name = entry.Category });
        }

        return entry;
    }

    public async Task<BlogEntry?> UpdateEntryAsync(string id, BlogEntry updatedEntry)
    {
        var filter = Builders<BlogEntry>.Filter.Eq(e => e.Id, id);

        var updateDef = Builders<BlogEntry>.Update
            .Set(e => e.Title, updatedEntry.Title)
            .Set(e => e.Description, updatedEntry.Description)
            .Set(e => e.Category, updatedEntry.Category)
            .Set(e => e.Content, updatedEntry.Content)
            .Set(e => e.CommentsAllowed, updatedEntry.CommentsAllowed)
            .Push(e => e.EditDates, DateTime.UtcNow.ToString("o"));

        var options = new FindOneAndUpdateOptions<BlogEntry>
        {
            ReturnDocument = ReturnDocument.After
        };

        var result = await _entries.FindOneAndUpdateAsync(filter, updateDef, options);

        // Kategorie automatisch anlegen falls nicht vorhanden
        if (result != null)
        {
            var existingCategory = await _categories.Find(c => c.Name == updatedEntry.Category).FirstOrDefaultAsync();
            if (existingCategory == null)
            {
                await _categories.InsertOneAsync(new BlogCategory { Name = updatedEntry.Category });
            }
        }

        return result;
    }

    public async Task<bool> DeleteEntryAsync(string id)
    {
        // Auch zugehörige Kommentare löschen
        await _comments.DeleteManyAsync(c => c.EntryId == id);

        var result = await _entries.DeleteOneAsync(e => e.Id == id);
        return result.DeletedCount > 0;
    }

    // ═══════════════════════════════════════════════════════════
    // COMPUTED PATTERN
    // (https://www.mongodb.com/company/blog/building-with-patterns-the-computed-pattern)
    //
    // Der ImpressionCount wird als vorberechneter Wert direkt im
    // Dokument gespeichert und mit der atomaren $inc-Operation
    // aktualisiert. Kein Read-Modify-Write, kein count() über
    // eine separate Impressions-Collection.
    // ═══════════════════════════════════════════════════════════
    public async Task IncrementImpressionCountAsync(string id)
    {
        var filter = Builders<BlogEntry>.Filter.Eq(e => e.Id, id);
        var update = Builders<BlogEntry>.Update.Inc(e => e.ImpressionCount, 1);
        await _entries.UpdateOneAsync(filter, update); // ← Computed Pattern: atomarer $inc
    }

    // ════════════════════════════════════════
    //  COMMENTS
    // ════════════════════════════════════════

    public async Task<List<BlogComment>> GetCommentsByEntryIdAsync(string entryId)
    {
        return await _comments.Find(c => c.EntryId == entryId)
            .SortBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<BlogComment> CreateCommentAsync(BlogComment comment)
    {
        await _comments.InsertOneAsync(comment);
        return comment;
    }

    public async Task<bool> DeleteCommentAsync(string commentId)
    {
        var result = await _comments.DeleteOneAsync(c => c.Id == commentId);
        return result.DeletedCount > 0;
    }

    public async Task<BlogComment?> GetCommentByIdAsync(string commentId)
    {
        return await _comments.Find(c => c.Id == commentId).FirstOrDefaultAsync();
    }

    // ════════════════════════════════════════
    //  CATEGORIES
    // ════════════════════════════════════════

    public async Task<List<BlogCategory>> GetAllCategoriesAsync()
    {
        return await _categories.Find(_ => true).ToListAsync();
    }

    // ════════════════════════════════════════
    //  USERS (für Extended Reference Pattern)
    // ════════════════════════════════════════

    public async Task<BlogUser?> GetBlogUserByEmailAsync(string email)
    {
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<BlogUser?> GetBlogUserByIdAsync(string userId)
    {
        // Die UserId aus dem JWT kann eine GUID sein (kein gültiger ObjectId).
        // Daher prüfen wir zuerst, ob es ein gültiger ObjectId ist.
        if (MongoDB.Bson.ObjectId.TryParse(userId, out _))
        {
            return await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        }

        // Falls keine gültige ObjectId (z.B. GUID aus dem JWT-Token),
        // kann kein User mit dieser _id existieren → null zurückgeben.
        return null;
    }

    public async Task<BlogUser> CreateBlogUserAsync(BlogUser user)
    {
        await _users.InsertOneAsync(user);
        return user;
    }
}

