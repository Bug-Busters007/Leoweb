using Leoweb.Server.Database.Models.Blog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Leoweb.Server.Controllers;

/// <summary>
/// Alle Query-Endpoints für das Blog-System.
/// Entspricht den mongosh-Queries in queries.mongodb.js.
/// </summary>
[ApiController]
[Route("api/Blog/query")]
[AllowAnonymous]
public class BlogQueryController : ControllerBase
{
    private readonly IMongoCollection<BlogEntry> _entries;
    private readonly IMongoCollection<BlogComment> _comments;
    private readonly IMongoCollection<BlogUser> _users;

    public BlogQueryController(IMongoDatabase database)
    {
        _entries = database.GetCollection<BlogEntry>("blogEntries");
        _comments = database.GetCollection<BlogComment>("blogComments");
        _users = database.GetCollection<BlogUser>("blogUsers");
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 1
    // Alle Blog-User, bei denen Username UND Password übereinstimmen.
    // GET api/Blog/query/users/login?username=jdoe&password=hashed_password_1
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("users/login")]
    public async Task<IActionResult> Q1_UserByUsernameAndPassword(
        [FromQuery] string username,
        [FromQuery] string password)
    {
        var filter = Builders<BlogUser>.Filter.And(
            Builders<BlogUser>.Filter.Eq(u => u.Username, username),
            Builders<BlogUser>.Filter.Eq(u => u.Password, password)
        );
        var result = await _users.Find(filter).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 2
    // Alle Blog-Einträge eines bestimmten Autors (username).
    // GET api/Blog/query/entries/by-author?username=jdoe
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/by-author")]
    public async Task<IActionResult> Q2_EntriesByAuthorUsername([FromQuery] string username)
    {
        var filter = Builders<BlogEntry>.Filter.Eq("author.username", username);
        var result = await _entries.Find(filter).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 3
    // Alle Blog-Einträge, bei denen content.tags leer oder nicht gesetzt ist
    // (zusätzliches Feld ohne Information).
    // GET api/Blog/query/entries/missing-tags
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/missing-tags")]
    public async Task<IActionResult> Q3_EntriesWithoutTags()
    {
        var filter = Builders<BlogEntry>.Filter.Or(
            Builders<BlogEntry>.Filter.Exists("content.tags", false),
            Builders<BlogEntry>.Filter.Size("content.tags", 0)
        );
        var result = await _entries.Find(filter).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 4
    // Alle Blog-Einträge mit mehr als 1 Bild.
    // GET api/Blog/query/entries/multiple-images
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/multiple-images")]
    public async Task<IActionResult> Q4_EntriesWithMoreThanOneImage()
    {
        var filter = Builders<BlogEntry>.Filter.SizeGt("content.images", 1);
        var result = await _entries.Find(filter).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 5
    // Alle Blog-Einträge, die mindestens 1 Bild enthalten.
    // GET api/Blog/query/entries/with-images
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/with-images")]
    public async Task<IActionResult> Q5_EntriesWithImages()
    {
        var filter = Builders<BlogEntry>.Filter.SizeGt("content.images", 0);
        var result = await _entries.Find(filter).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 6
    // Alle Blog-Einträge, deren Autor entweder einen bestimmten Nachnamen hat
    // ODER 'admin' ist – aber NICHT 'Guest'.
    // GET api/Blog/query/entries/author-filter?lastname=Doe
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/author-filter")]
    public async Task<IActionResult> Q6_EntriesByLastnameOrAdmin([FromQuery] string lastname)
    {
        var filter = Builders<BlogEntry>.Filter.And(
            Builders<BlogEntry>.Filter.Or(
                Builders<BlogEntry>.Filter.Eq("author.lastname", lastname),
                Builders<BlogEntry>.Filter.Eq("author.username", "admin")
            ),
            Builders<BlogEntry>.Filter.Ne("author.username", "Guest")
        );
        var result = await _entries.Find(filter).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 7
    // Alle Blog-Einträge, bei denen der Titel im content.text vorkommt.
    // GET api/Blog/query/entries/title-in-content
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/title-in-content")]
    public async Task<IActionResult> Q7_EntriesWhereTitleInContent()
    {
        // Aggregation mit $expr + $indexOfCP (case-insensitive via $toLower)
        var pipeline = new[]
        {
            new BsonDocument("$match", new BsonDocument("$expr", new BsonDocument("$gt", new BsonArray
            {
                new BsonDocument("$indexOfCP", new BsonArray
                {
                    new BsonDocument("$toLower", "$content.text"),
                    new BsonDocument("$toLower", "$title")
                }),
                -1
            })))
        };

        var result = await _entries.Aggregate<BsonDocument>(pipeline).ToListAsync();
        return Ok(result.Select(d => d.ToJson()).ToList());
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 8
    // Alle Blog-User aufsteigend sortiert nach username.
    // GET api/Blog/query/users/sorted
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("users/sorted")]
    public async Task<IActionResult> Q8_UsersSortedByUsername()
    {
        var result = await _users.Find(_ => true).SortBy(u => u.Username).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 9
    // Die 2 neuesten Blog-Einträge (nach creationDate absteigend).
    // GET api/Blog/query/entries/newest?count=2
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/newest")]
    public async Task<IActionResult> Q9_NewestEntries([FromQuery] int count = 2)
    {
        var result = await _entries.Find(_ => true)
            .SortByDescending(e => e.CreationDate)
            .Limit(count)
            .ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 10
    // Der zweitälteste Blog-Eintrag (aufsteigend, skip 1, limit 1).
    // GET api/Blog/query/entries/second-oldest
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/second-oldest")]
    public async Task<IActionResult> Q10_SecondOldestEntry()
    {
        var result = await _entries.Find(_ => true)
            .SortBy(e => e.CreationDate)
            .Skip(1)
            .Limit(1)
            .ToListAsync();

        if (!result.Any()) return NotFound("Nicht genug Einträge vorhanden.");
        return Ok(result.First());
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 11
    // Alle Blog-Einträge der letzten 7 Tage mit mindestens 1 Link.
    // GET api/Blog/query/entries/recent-with-links
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("entries/recent-with-links")]
    public async Task<IActionResult> Q11_RecentEntriesWithLinks()
    {
        var oneWeekAgoIso = DateTime.UtcNow.AddDays(-7).ToString("o");

        var filter = Builders<BlogEntry>.Filter.And(
            Builders<BlogEntry>.Filter.Gte(e => e.CreationDate, oneWeekAgoIso),
            Builders<BlogEntry>.Filter.SizeGt("content.links", 0)
        );

        var result = await _entries.Find(filter).ToListAsync();
        return Ok(result);
    }

    // ══════════════════════════════════════════════════════════════════════
    // QUERY 12
    // Die 2 neuesten Blog-Kommentare zu Einträgen eines bestimmten Autors
    // (username). Aggregation mit $lookup.
    // GET api/Blog/query/comments/newest-by-author?username=jdoe
    // ══════════════════════════════════════════════════════════════════════
    [HttpGet("comments/newest-by-author")]
    public async Task<IActionResult> Q12_NewestCommentsByAuthorEntries([FromQuery] string username)
    {
        var pipeline = new[]
        {
            // Kommentare mit den zugehörigen Einträgen joinen (entryId → _id)
            new BsonDocument("$lookup", new BsonDocument
            {
                { "from", "blogEntries" },
                { "let", new BsonDocument("eid", "$entryId") },
                {
                    "pipeline", new BsonArray
                    {
                        new BsonDocument("$match", new BsonDocument("$expr",
                            new BsonDocument("$eq", new BsonArray
                            {
                                new BsonDocument("$toString", "$_id"),
                                "$$eid"
                            })
                        ))
                    }
                },
                { "as", "entry" }
            }),
            // Nur Kommentare zu Einträgen des gesuchten Autors behalten
            new BsonDocument("$match", new BsonDocument
            {
                { "entry", new BsonDocument("$not", new BsonDocument("$size", 0)) },
                { "entry.author.username", username }
            }),
            // Neueste zuerst
            new BsonDocument("$sort", new BsonDocument("createdAt", -1)),
            // Nur die 2 neuesten
            new BsonDocument("$limit", 2),
            // entry-Hilfsspalte entfernen
            new BsonDocument("$project", new BsonDocument("entry", 0))
        };

        var result = await _comments.Aggregate<BsonDocument>(pipeline).ToListAsync();
        return Ok(result.Select(d => d.ToJson()).ToList());
    }
}

