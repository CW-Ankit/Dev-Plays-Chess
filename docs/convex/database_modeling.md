# Database & Data Modeling

## Core Concepts
- **Tables:** Dynamic collections of documents.
- **Documents:** JSON-like objects.
- **System Fields:** `_id` (Unique ID) and `_creationTime` (Timestamp).

## Reading Data
- **Single Doc:** `ctx.db.get(tableName, id)`.
- **Queries:** `ctx.db.query(tableName)`.
- **Ordering:** Default is `_creationTime` ascending. Use `.order("desc")` for newest first.
- **Retrieval:** `.collect()` (all), `.take(n)` (limit), `.first()` (first match), `.unique()` (exactly one).

## Writing Data
- **Insert:** `ctx.db.insert(tableName, data)` returns a new ID.
- **Patch:** `ctx.db.patch(tableName, id, data)` shallow merge (sets `undefined` to remove field).
- **Replace:** `ctx.db.replace(tableName, id, data)` full document overwrite.
- **Delete:** `ctx.db.delete(tableName, id)`.

## Relational Modeling
- **References:** Embed the `Id<"tableName">` of one document in another.
- **Joins:** Performed in JS by fetching the referenced document using the ID. Use `Promise.all` for parallel fetches to maintain performance.
- **Nesting:** Avoid deeply nested objects/arrays; prefer separate tables and references.

## Schemas
- Defined in `convex/schema.ts` using `defineSchema` and `defineTable`.
- Provides runtime validation and end-to-end TypeScript type safety.
- **Validators:** `v.string()`, `v.number()`, `v.id("table")`, `v.optional()`, `v.union()`, `v.literal()`.
