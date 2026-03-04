using Leoweb.Server.Database.Models.Blog;

namespace Leoweb.Server.Services;

public interface IBlogService
{
    // Entries
    Task<List<BlogEntry>> GetAllEntriesAsync();
    Task<BlogEntry?> GetEntryByIdAsync(string id);
    Task<List<BlogEntry>> GetEntriesByCategoryAsync(string category);
    Task<BlogEntry> CreateEntryAsync(BlogEntry entry);
    Task<BlogEntry?> UpdateEntryAsync(string id, BlogEntry updatedEntry);
    Task<bool> DeleteEntryAsync(string id);
    Task IncrementImpressionCountAsync(string id);

    // Comments
    Task<List<BlogComment>> GetCommentsByEntryIdAsync(string entryId);
    Task<BlogComment> CreateCommentAsync(BlogComment comment);
    Task<bool> DeleteCommentAsync(string commentId);
    Task<BlogComment?> GetCommentByIdAsync(string commentId);

    // Categories
    Task<List<BlogCategory>> GetAllCategoriesAsync();

    // Users
    Task<BlogUser?> GetBlogUserByEmailAsync(string email);
    Task<BlogUser?> GetBlogUserByIdAsync(string userId);
    Task<BlogUser> CreateBlogUserAsync(BlogUser user);
}

