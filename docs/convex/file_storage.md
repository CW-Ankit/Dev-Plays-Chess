# File Storage

Convex provides built-in file storage for uploading, storing, and serving files.

## Uploading Files
There are two primary ways to upload files:

### 1. Upload URLs (For large files)
The recommended flow for arbitrarily large files:
1. **Generate URL:** Call a mutation that returns `await ctx.storage.generateUploadUrl()`.
2. **Client POST:** The client POSTs the file to this short-lived URL (expires in 1 hour).
3. **Save ID:** The client receives a `storageId` (of type `Id<"_storage">`) and sends it back to a mutation to be saved in the database.

### 2. HTTP Actions (For files < 20MB)
Use `ctx.storage.store(blob)` inside an HTTP action or Action. This is a single-request flow but is limited to 20MB.

## Storing & Managing Files
- **Manual Storage:** In actions/HTTP actions, use `await ctx.storage.store(blob)` to save a blob and get a `storageId`.
- **Deletion:** Use `await ctx.storage.delete(storageId)` in mutations, actions, or HTTP actions.
- **Metadata:** File metadata is stored in the `_storage` system table. Access it via `ctx.db.system.get("_storage", storageId)`.
  - Fields: `sha256`, `size`, `contentType`.

## Serving Files
- **Generating URLs:** Use `await ctx.storage.getUrl(storageId)` in queries or mutations. This creates a public URL for the file.
- **Custom Serving:** Use an HTTP action with `ctx.storage.get(storageId)` to return a `Blob` in a `Response`. This allows for fine-grained access control at the time of serving.
