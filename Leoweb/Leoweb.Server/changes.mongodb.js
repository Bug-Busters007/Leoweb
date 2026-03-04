// ╔══════════════════════════════════════════════════════════════════════╗
// ║          LeoBlog – MongoDB Changes (mongosh)                         ║
// ║          Datenbank: leoblog                                          ║
// ╚══════════════════════════════════════════════════════════════════════╝
//
// Ausführen mit:  mongosh "mongodb://localhost:27017/leoblog" changes.mongodb.js
//
// Collections:
//   blogUsers      – Blog-User
//   blogEntries    – Blog-Einträge (content.tags = zusätzliches Feld)
//   blogComments   – Blog-Kommentare
//   blogCategories – Blog-Kategorien

use("leoblog");

// ══════════════════════════════════════════════════════════════════════════
// CHANGE 1
// Einen zusätzlichen Autor zu einem bestehenden Blog-Eintrag hinzufügen.
// Da das author-Feld ein einzelnes Subdocument ist, wird es in ein Array
// "authors" umgewandelt, um mehrere Autoren zu unterstützen.
// Alternativ: Wenn nur ein Autor möglich ist, wird der Autor geändert.
//
// Variante A – Autor ändern (einzelnes author-Feld):
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ CHANGE 1: Autor eines Blog-Eintrags ändern ═══");

// Den zweiten User als neuen Co-Autor holen
{
    const coAuthor = db.blogUsers.findOne({ username: "asmith" });

    // Autor des ersten Blog-Eintrags (von jdoe) ändern auf asmith
    const result = db.blogEntries.updateOne(
        { "author.username": "jdoe" },
        {
            $set: {
                "author": {
                    userId: coAuthor._id.toString(),
                    username: coAuthor.username,
                    firstname: coAuthor.firstname,
                    lastname: coAuthor.lastname
                }
            }
        }
    );
    printjson(result);
}


// ══════════════════════════════════════════════════════════════════════════
// CHANGE 2
// Den neuesten Blog-Eintrag um ein zusätzliches Feld "hashtag" erweitern.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ CHANGE 2: Neuesten Blog-Eintrag um 'hashtag' erweitern ═══");

{
    const newestEntry = db.blogEntries.findOne({}, { sort: { creationDate: -1 } });

    const result = db.blogEntries.updateOne(
        { _id: newestEntry._id },
        {
            $set: {
                hashtag: "#Podcasts #Tech #Softwareentwicklung"
            }
        }
    );
    printjson(result);

    // Ergebnis anzeigen
    print("Aktualisierter Eintrag:");
    printjson(db.blogEntries.findOne({ _id: newestEntry._id }));
}


// ══════════════════════════════════════════════════════════════════════════
// CHANGE 3
// Den Namen einer Blog-Kategorie ändern.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ CHANGE 3: Kategoriename ändern ═══");

{
    // "Lifestyle" → "Lifestyle & Kultur"
    const result = db.blogCategories.updateOne(
        { name: "Lifestyle" },
        { $set: { name: "Lifestyle & Kultur" } }
    );
    printjson(result);

    // Auch alle Blog-Einträge mit dieser Kategorie aktualisieren (Denormalisierung)
    const entryResult = db.blogEntries.updateMany(
        { category: "Lifestyle" },
        { $set: { category: "Lifestyle & Kultur" } }
    );
    print("Blog-Einträge aktualisiert:");
    printjson(entryResult);
}


// ══════════════════════════════════════════════════════════════════════════
// CHANGE 4
// Einen Blog-Eintrag hinzufügen – falls er bereits existiert (gleicher
// Titel + gleicher Autor), wird er nur aktualisiert (Upsert).
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ CHANGE 4: Blog-Eintrag Upsert (Insert oder Update) ═══");

{
    const author = db.blogUsers.findOne({ username: "mmueller" });

    const result = db.blogEntries.updateOne(
        {
            title: "Neuer Upsert-Eintrag",
            "author.username": author.username
        },
        {
            $set: {
                title: "Neuer Upsert-Eintrag",
                author: {
                    userId: author._id.toString(),
                    username: author.username,
                    firstname: author.firstname,
                    lastname: author.lastname
                },
                description: "Dieser Eintrag wurde per Upsert erstellt oder aktualisiert.",
                category: "Technologie",
                creationDate: new Date().toISOString(),
                editDates: [],
                impressionCount: NumberLong(0),
                content: {
                    text: "Inhalt des Upsert-Eintrags. Wird bei erneutem Ausführen aktualisiert.",
                    links: ["https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/"],
                    images: [],
                    tags: ["upsert", "mongodb"]
                },
                commentsAllowed: true
            },
            $setOnInsert: {
                creationDate: new Date().toISOString()
            }
        },
        { upsert: true }
    );
    printjson(result);
}


// ══════════════════════════════════════════════════════════════════════════
// CHANGE 5
// Einen Blog-Eintrag und seine zugehörigen Kommentare löschen.
// ══════════════════════════════════════════════════════════════════════════
print("\n═══ CHANGE 5: Blog-Eintrag und seine Kommentare löschen ═══");

{
    // Den Upsert-Eintrag von oben wieder löschen
    const entry = db.blogEntries.findOne({ title: "Neuer Upsert-Eintrag" });

    if (entry) {
        // Zuerst alle Kommentare zu diesem Eintrag löschen
        const commentResult = db.blogComments.deleteMany({
            entryId: entry._id.toString()
        });
        print("Gelöschte Kommentare:");
        printjson(commentResult);

        // Dann den Eintrag selbst löschen
        const entryResult = db.blogEntries.deleteOne({ _id: entry._id });
        print("Gelöschter Eintrag:");
        printjson(entryResult);
    } else {
        print("Kein Eintrag mit dem Titel 'Neuer Upsert-Eintrag' gefunden.");
    }
}

