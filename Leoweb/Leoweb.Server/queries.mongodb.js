// ╔══════════════════════════════════════════════════════════════════════╗
// ║          LeoBlog – MongoDB Queries (mongosh)                         ║
// ║          Datenbank: leoblog                                          ║
// ╚══════════════════════════════════════════════════════════════════════╝
//
// Ausführen mit:  mongosh "mongodb://localhost:27017/leoblog" queries.mongodb.js
//
// Collections:
//   blogUsers     – Blog-User
//   blogEntries   – Blog-Einträge (content.tags = zusätzliches Feld)
//   blogComments  – Blog-Kommentare

use("leoblog");

// ══════════════════════════════════════════════════════════════════════════
// QUERY 1
// Alle Blog-User, bei denen Username UND Password mit gegebenen Werten
// übereinstimmen.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 1: Blog-User mit username + password ═══");

printjson(db.blogUsers.find({
    username: "jdoe",
    password: "hashed_password_1"
}).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 2
// Alle Blog-Einträge, die von einem bestimmten Blog-User (username)
// verfasst wurden.
// Hinweis: author ist ein embedded Subdocument (Extended Reference Pattern)
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 2: Blog-Einträge eines bestimmten Autors (username) ═══");

printjson(db.blogEntries.find({
    "author.username": "jdoe"
}).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 3
// Alle Blog-Einträge, die in einem der zusätzlichen Felder KEINE Information
// enthalten – hier: content.tags ist leer ([]) oder fehlt komplett.
// (tags ist das zusätzliche Feld in BlogContent)
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 3: Blog-Einträge ohne Tags (leeres zusätzliches Feld) ═══");

printjson(db.blogEntries.find({
    $or: [
        { "content.tags": { $exists: false } },
        { "content.tags": { $size: 0 } }
    ]
}).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 4
// Alle Blog-Einträge, die mehr als 1 Bild enthalten.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 4: Blog-Einträge mit mehr als 1 Bild ═══");

printjson(db.blogEntries.find({
    $expr: { $gt: [{ $size: "$content.images" }, 1] }
}).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 5
// Alle Blog-Einträge, die mindestens 1 Bild enthalten.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 5: Blog-Einträge mit mindestens 1 Bild ═══");

printjson(db.blogEntries.find({
    "content.images": { $exists: true },
    $expr: { $gt: [{ $size: "$content.images" }, 0] }
}).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 6
// Alle Blog-Einträge, deren Autor entweder einen bestimmten Nachnamen hat
// ODER den Wert 'admin' hat – aber NICHT 'Guest'.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 6: Autor mit bestimmtem Lastname oder 'admin', aber nicht 'Guest' ═══");

printjson(db.blogEntries.find({
    $and: [
        {
            $or: [
                { "author.lastname": "Doe" },
                { "author.username": "admin" }
            ]
        },
        { "author.username": { $ne: "Guest" } }
    ]
}).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 7
// Alle Blog-Einträge, bei denen der Titel auch im Content-Text vorkommt.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 7: Blog-Einträge, deren Titel im content.text vorkommt ═══");

printjson(db.blogEntries.find({
    $expr: {
        $gt: [
            {
                $indexOfCP: [
                    { $toLower: "$content.text" },
                    { $toLower: "$title" }
                ]
            },
            -1
        ]
    }
}).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 8
// Alle Blog-User, aufsteigend sortiert nach username.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 8: Alle Blog-User aufsteigend nach username ═══");

printjson(db.blogUsers.find({}).sort({ username: 1 }).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 9
// Die 2 neuesten Blog-Einträge (nach creationDate absteigend).
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 9: Die 2 neuesten Blog-Einträge ═══");

printjson(db.blogEntries.find({}).sort({ creationDate: -1 }).limit(2).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 10
// Der zweitälteste Blog-Eintrag (nach creationDate aufsteigend, skip 1).
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 10: Der zweitälteste Blog-Eintrag ═══");

printjson(db.blogEntries.find({}).sort({ creationDate: 1 }).skip(1).limit(1).toArray());


// ══════════════════════════════════════════════════════════════════════════
// QUERY 11
// Alle Blog-Einträge, die innerhalb der letzten Woche erstellt wurden
// UND mindestens einen Link enthalten.
// Block-Scope {} verhindert const-Konflikte mit anderen Queries.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 11: Blog-Einträge der letzten 7 Tage mit mindestens 1 Link ═══");

{
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    printjson(db.blogEntries.find({
        creationDate: { $gte: oneWeekAgoISO },
        "content.links": { $exists: true },
        $expr: { $gt: [{ $size: "$content.links" }, 0] }
    }).toArray());
}


// ══════════════════════════════════════════════════════════════════════════
// QUERY 12
// Die 2 neuesten Blog-Kommentare zu Einträgen eines bestimmten Autors
// (username). Verwendet eine $lookup-Aggregation.
// Hinweis: entryId wird als String gespeichert, _id als ObjectId →
//          $toString konvertiert _id für den Vergleich.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ QUERY 12: Die 2 neuesten Kommentare zu Einträgen eines Autors ═══");

printjson(db.blogComments.aggregate([
    {
        $lookup: {
            from: "blogEntries",
            let: { eid: "$entryId" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [{ $toString: "$_id" }, "$$eid"]
                        }
                    }
                }
            ],
            as: "entry"
        }
    },
    { $unwind: "$entry" },
    {
        $match: {
            "entry.author.username": "jdoe"
        }
    },
    { $sort: { createdAt: -1 } },
    { $limit: 2 },
    { $project: { entry: 0 } }
]).toArray());
