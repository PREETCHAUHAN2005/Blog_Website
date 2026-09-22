const fallback = {
  appwriteUrl: "https://nyc.cloud.appwrite.io/v1",
  appwriteProjectId: "689b279c000047cd929c",
  appwriteDatabaseId: "689b2bb60004ead5fad4",
  appwriteCollectionId: "689b2c320019d90eb3be",
  appwriteBucketId: "689b3318000a21602472",
};

function readEnv(value, backup) {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/^["']|["']$/g, "");
  if (!cleaned || cleaned === "undefined" || cleaned === "null") return backup;
  return cleaned;
}

const conf = {
  appwriteUrl: readEnv(import.meta.env.VITE_APPWRITE_URL, fallback.appwriteUrl),
  appwriteProjectId: readEnv(
    import.meta.env.VITE_APPWRITE_PROJECT_ID,
    fallback.appwriteProjectId
  ),
  appwriteDatabaseId: readEnv(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    fallback.appwriteDatabaseId
  ),
  appwriteCollectionId: readEnv(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    fallback.appwriteCollectionId
  ),
  appwriteBucketId: readEnv(
    import.meta.env.VITE_APPWRITE_BUCKET_ID,
    fallback.appwriteBucketId
  ),
};

export default conf;
