# Aiblog

A React blog with account sign-in, public posts, drafts, search, and image thumbnails. The API client talks to Appwrite. If that project is paused or offline, the same screens keep working with data saved in the browser.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints. Sign up, create a post, then open it from Home.

## Appwrite

Copy `.env` and set:

- `VITE_APPWRITE_URL`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_COLLECTION_ID`
- `VITE_APPWRITE_BUCKET_ID`

The posts collection uses `title`, `content`, `featuredImage`, `status` (`active` or `inactive`), and `userId`. Restore the project from the Appwrite console if requests return `project_paused`.
