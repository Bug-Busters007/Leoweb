using Leoweb.Server.Database.Models.Blog;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Leoweb.Server.Services;

/// <summary>
/// Seed-Daten für das Blog-System.
/// Wird beim App-Start ausgeführt, wenn die Collections leer sind.
/// </summary>
public static class BlogSeeder
{
    public static async Task SeedAsync(IMongoDatabase database)
    {
        var usersCollection = database.GetCollection<BlogUser>("blogUsers");
        var entriesCollection = database.GetCollection<BlogEntry>("blogEntries");
        var commentsCollection = database.GetCollection<BlogComment>("blogComments");
        var categoriesCollection = database.GetCollection<BlogCategory>("blogCategories");

        // ════════════════════════════════════════
        // Schema-Validation für blogEntries erstellen
        // ════════════════════════════════════════
        await CreateSchemaValidation(database);

        // Nur seeden wenn Collections leer sind
        if (await usersCollection.CountDocumentsAsync(_ => true) > 0)
            return;

        // ════════════════════════════════════════
        //  5 Blog-User
        // ════════════════════════════════════════
        var users = new List<BlogUser>
        {
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Username = "jdoe",
                Firstname = "John",
                Lastname = "Doe",
                Email = "john.doe@students.htl-leonding.ac.at",
                Password = "hashed_password_1"
            },
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Username = "asmith",
                Firstname = "Anna",
                Lastname = "Smith",
                Email = "anna.smith@students.htl-leonding.ac.at",
                Password = "hashed_password_2"
            },
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Username = "mmueller",
                Firstname = "Max",
                Lastname = "Müller",
                Email = "max.mueller@students.htl-leonding.ac.at",
                Password = "hashed_password_3"
            },
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Username = "lgruber",
                Firstname = "Lisa",
                Lastname = "Gruber",
                Email = "lisa.gruber@students.htl-leonding.ac.at",
                Password = "hashed_password_4"
            },
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Username = "twagner",
                Firstname = "Thomas",
                Lastname = "Wagner",
                Email = "thomas.wagner@students.htl-leonding.ac.at",
                Password = "hashed_password_5"
            }
        };

        await usersCollection.InsertManyAsync(users);

        // ════════════════════════════════════════
        //  Mindestens 3 Kategorien
        // ════════════════════════════════════════
        var categories = new List<BlogCategory>
        {
            new() { Name = "Technologie" },
            new() { Name = "Lifestyle" },
            new() { Name = "Wissenschaft" }
        };

        await categoriesCollection.InsertManyAsync(categories);

        // Unique Index auf Category-Name
        var indexKeys = Builders<BlogCategory>.IndexKeys.Ascending(c => c.Name);
        var indexOptions = new CreateIndexOptions { Unique = true };
        await categoriesCollection.Indexes.CreateOneAsync(
            new CreateIndexModel<BlogCategory>(indexKeys, indexOptions));

        // ════════════════════════════════════════
        //  Kleines 1x1 Pixel PNG als base64 (Platzhalter-Bild)
        // ════════════════════════════════════════
        const string tinyPngBase64 =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

        // ════════════════════════════════════════
        //  5 Blog-Einträge in 3 Kategorien
        //  EXTENDED REFERENCE PATTERN: Author-Daten embedded
        // ════════════════════════════════════════
        var entries = new List<BlogEntry>
        {
            // Eintrag 1: Technologie, mit Bild, commentsAllowed = true
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Die Zukunft von KI in der Softwareentwicklung",
                Author = new BlogAuthor
                {
                    UserId = users[0].Id,
                    Username = users[0].Username,
                    Firstname = users[0].Firstname,
                    Lastname = users[0].Lastname
                },
                Description = "Ein Überblick über aktuelle KI-Trends und deren Einfluss auf die Softwareentwicklung.",
                Category = "Technologie",
                CreationDate = DateTime.UtcNow.AddDays(-10).ToString("o"),
                EditDates = new List<string>(),
                ImpressionCount = 42,
                Content = new BlogContent
                {
                    Text = "Künstliche Intelligenz verändert die Art, wie wir Software entwickeln. " +
                           "Von Code-Completion bis hin zu automatisierten Tests – KI-Tools werden " +
                           "immer leistungsfähiger. In diesem Artikel schauen wir uns die wichtigsten " +
                           "Trends an und diskutieren, was das für Entwickler bedeutet.",
                    Links = new List<string> { "https://openai.com", "https://github.com/features/copilot" },
                    Images = new List<string> { tinyPngBase64 }
                },
                CommentsAllowed = true
            },
            // Eintrag 2: Lifestyle, mit Links, commentsAllowed = true
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Work-Life-Balance als Entwickler",
                Author = new BlogAuthor
                {
                    UserId = users[1].Id,
                    Username = users[1].Username,
                    Firstname = users[1].Firstname,
                    Lastname = users[1].Lastname
                },
                Description = "Tipps für eine gesunde Balance zwischen Arbeit und Freizeit in der IT-Branche.",
                Category = "Lifestyle",
                CreationDate = DateTime.UtcNow.AddDays(-8).ToString("o"),
                EditDates = new List<string> { DateTime.UtcNow.AddDays(-5).ToString("o") },
                ImpressionCount = 28,
                Content = new BlogContent
                {
                    Text = "Als Entwickler ist es leicht, sich in Projekten zu verlieren. " +
                           "Hier sind 5 Tipps, wie man trotz Deadline-Druck eine gesunde " +
                           "Work-Life-Balance aufrechterhalten kann.",
                    Links = new List<string> { "https://www.mindful.org" },
                    Images = new List<string>()
                },
                CommentsAllowed = true
            },
            // Eintrag 3: Wissenschaft, commentsAllowed = true
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Quantencomputing erklärt",
                Author = new BlogAuthor
                {
                    UserId = users[2].Id,
                    Username = users[2].Username,
                    Firstname = users[2].Firstname,
                    Lastname = users[2].Lastname
                },
                Description = "Eine einfache Einführung in die Welt der Quantencomputer.",
                Category = "Wissenschaft",
                CreationDate = DateTime.UtcNow.AddDays(-6).ToString("o"),
                EditDates = new List<string>(),
                ImpressionCount = 15,
                Content = new BlogContent
                {
                    Text = "Quantencomputer nutzen die Prinzipien der Quantenmechanik, um " +
                           "Berechnungen durchzuführen, die für klassische Computer unmöglich wären. " +
                           "Qubits können gleichzeitig 0 und 1 sein – das nennt man Superposition.",
                    Links = new List<string>(),
                    Images = new List<string>()
                },
                CommentsAllowed = true
            },
            // Eintrag 4: Technologie, commentsAllowed = false
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Warum MongoDB für Blogs ideal ist",
                Author = new BlogAuthor
                {
                    UserId = users[3].Id,
                    Username = users[3].Username,
                    Firstname = users[3].Firstname,
                    Lastname = users[3].Lastname
                },
                Description = "Ein Vergleich zwischen relationalen Datenbanken und MongoDB für Blog-Systeme.",
                Category = "Technologie",
                CreationDate = DateTime.UtcNow.AddDays(-3).ToString("o"),
                EditDates = new List<string>(),
                ImpressionCount = 7,
                Content = new BlogContent
                {
                    Text = "MongoDB eignet sich besonders gut für Blog-Systeme, da Blog-Einträge " +
                           "sich gut als Dokumente modellieren lassen. Flexible Schemas, embedded " +
                           "Documents und die horizontale Skalierbarkeit sind große Vorteile.",
                    Links = new List<string> { "https://www.mongodb.com" },
                    Images = new List<string>()
                },
                CommentsAllowed = false
            },
            // Eintrag 5: Lifestyle, mit Bild, commentsAllowed = true
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Die besten Programmier-Podcasts 2026",
                Author = new BlogAuthor
                {
                    UserId = users[4].Id,
                    Username = users[4].Username,
                    Firstname = users[4].Firstname,
                    Lastname = users[4].Lastname
                },
                Description = "Meine Top 5 Podcasts für Softwareentwickler und Technik-Enthusiasten.",
                Category = "Lifestyle",
                CreationDate = DateTime.UtcNow.AddDays(-1).ToString("o"),
                EditDates = new List<string>(),
                ImpressionCount = 3,
                Content = new BlogContent
                {
                    Text = "Podcasts sind eine tolle Möglichkeit, sich während dem Pendeln weiterzubilden. " +
                           "Hier sind meine Favoriten: Syntax.fm, The Changelog, Software Engineering Daily, " +
                           "CoRecursive und Developer Tea.",
                    Links = new List<string>
                    {
                        "https://syntax.fm",
                        "https://changelog.com",
                        "https://softwareengineeringdaily.com"
                    },
                    Images = new List<string> { tinyPngBase64 }
                },
                CommentsAllowed = true
            }
        };

        await entriesCollection.InsertManyAsync(entries);

        // ════════════════════════════════════════
        //  4 Kommentare auf 3 verschiedene Einträge
        //  (nur auf jene mit commentsAllowed: true)
        // ════════════════════════════════════════
        var comments = new List<BlogComment>
        {
            // Kommentar 1 auf Eintrag 1 (KI)
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                EntryId = entries[0].Id,
                Author = users[1].Id,
                Username = users[1].Username,
                Text = "Super Artikel! KI-gestützte Code-Completion hat meine Produktivität enorm gesteigert.",
                CreatedAt = DateTime.UtcNow.AddDays(-9).ToString("o")
            },
            // Kommentar 2 auf Eintrag 1 (KI)
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                EntryId = entries[0].Id,
                Author = users[2].Id,
                Username = users[2].Username,
                Text = "Interessant, aber ich mache mir Sorgen über die Qualität von KI-generiertem Code.",
                CreatedAt = DateTime.UtcNow.AddDays(-8).ToString("o")
            },
            // Kommentar 3 auf Eintrag 2 (Work-Life-Balance)
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                EntryId = entries[1].Id,
                Author = users[0].Id,
                Username = users[0].Username,
                Text = "Danke für die Tipps! Besonders der Punkt mit festen Feierabend-Zeiten hilft mir.",
                CreatedAt = DateTime.UtcNow.AddDays(-7).ToString("o")
            },
            // Kommentar 4 auf Eintrag 3 (Quantencomputing)
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                EntryId = entries[2].Id,
                Author = users[4].Id,
                Username = users[4].Username,
                Text = "Endlich eine verständliche Erklärung von Quantencomputing!",
                CreatedAt = DateTime.UtcNow.AddDays(-5).ToString("o")
            }
        };

        await commentsCollection.InsertManyAsync(comments);

        Console.WriteLine("✅ Blog-Daten erfolgreich geseedet: 5 User, 3 Kategorien, 5 Einträge, 4 Kommentare");
    }

    /// <summary>
    /// Erstellt MongoDB Schema-Validation für die blogEntries-Collection.
    /// Pflichtfelder: title, author, description, category, creationDate, impressionCount, content, commentsAllowed
    /// </summary>
    private static async Task CreateSchemaValidation(IMongoDatabase database)
    {
        var collectionNames = (await database.ListCollectionNamesAsync()).ToList();

        // Collection erstellen mit Schema-Validation falls sie noch nicht existiert
        if (!collectionNames.Contains("blogEntries"))
        {
            var validator = new BsonDocument
            {
                {
                    "$jsonSchema", new BsonDocument
                    {
                        { "bsonType", "object" },
                        {
                            "required", new BsonArray
                            {
                                "title", "author", "description", "category",
                                "creationDate", "impressionCount", "content", "commentsAllowed"
                            }
                        },
                        {
                            "properties", new BsonDocument
                            {
                                {
                                    "title", new BsonDocument
                                    {
                                        { "bsonType", "string" },
                                        { "description", "Titel des Blog-Eintrags – Pflichtfeld" }
                                    }
                                },
                                {
                                    "author", new BsonDocument
                                    {
                                        { "bsonType", "object" },
                                        { "description", "Extended Reference: Embedded Author-Daten" },
                                        {
                                            "required",
                                            new BsonArray { "userId", "username", "firstname", "lastname" }
                                        },
                                        {
                                            "properties", new BsonDocument
                                            {
                                                {
                                                    "userId",
                                                    new BsonDocument { { "bsonType", "string" } }
                                                },
                                                {
                                                    "username",
                                                    new BsonDocument { { "bsonType", "string" } }
                                                },
                                                {
                                                    "firstname",
                                                    new BsonDocument { { "bsonType", "string" } }
                                                },
                                                {
                                                    "lastname",
                                                    new BsonDocument { { "bsonType", "string" } }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "description", new BsonDocument
                                    {
                                        { "bsonType", "string" },
                                        { "description", "Beschreibung des Blog-Eintrags – Pflichtfeld" }
                                    }
                                },
                                {
                                    "category", new BsonDocument
                                    {
                                        { "bsonType", "string" },
                                        { "description", "Kategoriename – Pflichtfeld" }
                                    }
                                },
                                {
                                    "creationDate", new BsonDocument
                                    {
                                        { "bsonType", "string" },
                                        { "description", "Erstellungsdatum als ISO 8601 String – Pflichtfeld" }
                                    }
                                },
                                {
                                    "editDates", new BsonDocument
                                    {
                                        { "bsonType", "array" },
                                        {
                                            "items", new BsonDocument
                                            {
                                                { "bsonType", "string" }
                                            }
                                        },
                                        { "description", "Bearbeitungszeitpunkte als ISO 8601 Strings" }
                                    }
                                },
                                {
                                    "impressionCount", new BsonDocument
                                    {
                                        { "bsonType", "long" },
                                        { "description", "Computed Pattern: Vorberechneter Aufrufzähler – Pflichtfeld" }
                                    }
                                },
                                {
                                    "content", new BsonDocument
                                    {
                                        { "bsonType", "object" },
                                        { "description", "Inhalt des Blog-Eintrags – Pflichtfeld" },
                                        { "required", new BsonArray { "text" } },
                                        {
                                            "properties", new BsonDocument
                                            {
                                                {
                                                    "text",
                                                    new BsonDocument { { "bsonType", "string" } }
                                                },
                                                {
                                                    "links", new BsonDocument
                                                    {
                                                        { "bsonType", "array" },
                                                        {
                                                            "items",
                                                            new BsonDocument { { "bsonType", "string" } }
                                                        }
                                                    }
                                                },
                                                {
                                                    "images", new BsonDocument
                                                    {
                                                        { "bsonType", "array" },
                                                        {
                                                            "items",
                                                            new BsonDocument { { "bsonType", "string" } }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "commentsAllowed", new BsonDocument
                                    {
                                        { "bsonType", "bool" },
                                        { "description", "Ob Kommentare erlaubt sind – Pflichtfeld" }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // Schema-Validation via MongoDB create-Befehl setzen
            var createCommand = new BsonDocument
            {
                { "create", "blogEntries" },
                { "validator", validator },
                { "validationLevel", "strict" },
                { "validationAction", "error" }
            };

            await database.RunCommandAsync<BsonDocument>(createCommand);

            Console.WriteLine("✅ blogEntries Collection mit Schema-Validation erstellt");
        }
    }
}


