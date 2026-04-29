# Indexing & Performance

## Indexes
Indexes are sorted data structures that prevent "Full Table Scans."

- **Definition:** `.index("indexName", ["field1", "field2"])` in `schema.ts`.
- **Usage:** `.withIndex("indexName", (q) => q.eq("field1", value))`.
- **Compound Indexes:** Fields must be queried in the order they are defined in the index.

## Query Performance
- **Full Table Scan:** Occurs when using `.filter()` on a large table without a preceding index.
- **Index Range:** Performance depends on the number of documents within the specified range.
- **Sizing:** Use `.take(n)` or `.paginate()` to avoid reading too many documents.

## Pagination
- **Cursor-based:** Uses `paginationOptsValidator` and `.paginate(opts)`.
- **React Hook:** `usePaginatedQuery` manages cursors and loading states automatically.
