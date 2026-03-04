// ╔══════════════════════════════════════════════════════════════════════╗
// ║          LeoBlog – MongoDB Indexes (mongosh)                         ║
// ║          Datenbank: leoblog                                          ║
// ╚══════════════════════════════════════════════════════════════════════╝
//
// Ausführen mit:  mongosh "mongodb://localhost:27017/leoblog" indexes.mongodb.js
//
// Collections:
//   blogUsers    – Blog-User
//   blogEntries  – Blog-Einträge

use("leoblog");

// ══════════════════════════════════════════════════════════════════════════
// INDEX 1
// Unique-Index auf username in blogUsers.
// Stellt sicher, dass jeder Username nur einmal vergeben werden kann.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ INDEX 1: Unique-Index auf blogUsers.username ═══");

db.blogUsers.createIndex(
    { username: 1 },
    { unique: true, name: "idx_blogUsers_username_unique" }
);

print("✅ Unique-Index auf blogUsers.username erstellt.");
printjson(db.blogUsers.getIndexes());


// ══════════════════════════════════════════════════════════════════════════
// INDEX 2
// Compound Unique-Index auf title + author.username in blogEntries.
// Stellt sicher, dass ein Autor keinen zweiten Eintrag mit dem
// gleichen Titel erstellen kann.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ INDEX 2: Unique-Index auf blogEntries (title + author.username) ═══");

db.blogEntries.createIndex(
    { title: 1, "author.username": 1 },
    { unique: true, name: "idx_blogEntries_title_author_unique" }
);

print("✅ Unique-Index auf blogEntries (title + author.username) erstellt.");
printjson(db.blogEntries.getIndexes());

