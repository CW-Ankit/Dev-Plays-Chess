# AI & Search

Convex supports both Vector Search (semantic) and Full Text Search (keyword).

## Vector Search (Semantic)
Used for finding documents based on meaning (embeddings).

### Configuration
1. **Schema:** Define a `vectorIndex` on a table.
   ```ts
   table.vectorIndex("by_embedding", {
     vectorField: "embedding",
     dimensions: 1536, // e.g., OpenAI
     filterFields: ["category"],
   })
   ```
2. **Execution:** Vector search can **only** be performed in **Actions**.
   ```ts
   const results = await ctx.vectorSearch("table", "indexName", {
     vector: embedding,
     limit: 16,
     filter: (q) => q.eq("category", "news"),
   });
   ```
3. **Results:** Returns an array of `{ _id, _score }`. You must then use `ctx.runQuery` to fetch the actual documents.
4. **Ordering:** Results are returned in relevance order based on cosine similarity.

## Full Text Search (Keyword)
Used for keyword/phrase matching and typeahead search.

### Configuration
1. **Schema:** Define a `searchIndex`.
   ```ts
   table.searchIndex("search_body", {
     searchField: "body",
     filterFields: ["channel"],
   })
   ```
2. **Execution:** Performed in **Queries** (unlike Vector Search).
   ```ts
   const results = await ctx.db
     .query("table")
     .withSearchIndex("search_body", (q) => 
       q.search("body", "query string").eq("channel", "general")
     )
     .take(10);
   ```
3. **Behavior:** 
   - **Prefix Matching:** The final term in the query supports prefix matching (e.g., "r" matches "rabbit").
   - **Relevance:** Uses BM25 scoring.
   - **Reactivity:** Fully reactive and transactional.

## Comparison Summary
| Feature | Vector Search | Full Text Search |
| :--- | :--- | :--- |
| **Purpose** | Semantic meaning | Keyword matching |
| **Where it runs** | Actions only | Queries/Mutations |
| **Indexing** | `vectorIndex` | `searchIndex` |
| **Reactivity** | Not directly reactive | Fully reactive |
| **Ordering** | Cosine Similarity | BM25 / Relevance |
