const DB_KEY = "aiblog.db";

function emptyDb() {
  return { users: [], sessionUserId: null, posts: [] };
}

function loadDb() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DB_KEY) || "");
    if (!parsed || typeof parsed !== "object") return emptyDb();
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessionUserId: parsed.sessionUserId || null,
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    };
  } catch {
    return emptyDb();
  }
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function fileKey(fileId) {
  return `aiblog.file.${fileId}`;
}

function uniqueId() {
  if (crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  return Math.random().toString(36).slice(2, 14);
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
  return `sha256$${hex}`;
}

function publicUser(user) {
  return { $id: user.$id, name: user.name, email: user.email };
}

export async function createAccount({ email, password, name }) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
  if (!name?.trim()) throw new Error("Enter your name.");
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  const db = loadDb();
  if (db.users.some((user) => user.email === normalized)) {
    throw new Error("An account with this email already exists.");
  }
  const user = {
    $id: uniqueId(),
    name: name.trim(),
    email: normalized,
    passwordHash: await hashPassword(password),
  };
  db.users.push(user);
  db.sessionUserId = user.$id;
  saveDb(db);
  return { $id: uniqueId(), userId: user.$id };
}

export async function login({ email, password }) {
  const normalized = String(email || "").trim().toLowerCase();
  const db = loadDb();
  const user = db.users.find((item) => item.email === normalized);
  if (!user || user.passwordHash !== (await hashPassword(password || ""))) {
    throw new Error("Invalid email or password.");
  }
  db.sessionUserId = user.$id;
  saveDb(db);
  return { $id: uniqueId(), userId: user.$id };
}

export function getCurrentUser() {
  const db = loadDb();
  const user = db.users.find((item) => item.$id === db.sessionUserId);
  return user ? publicUser(user) : null;
}

export function logout() {
  const db = loadDb();
  db.sessionUserId = null;
  saveDb(db);
}

export function getPosts(filter = {}) {
  const db = loadDb();
  const documents = db.posts
    .filter((post) => (filter.status ? post.status === filter.status : true))
    .filter((post) => (filter.userId ? post.userId === filter.userId : true))
    .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
  return { total: documents.length, documents };
}

export function getPost(slug) {
  const post = loadDb().posts.find((item) => item.$id === slug);
  if (!post) {
    const error = new Error("Post not found.");
    error.code = 404;
    throw error;
  }
  return post;
}

function currentUser(db) {
  return db.users.find((user) => user.$id === db.sessionUserId) || null;
}

export function createPost({ title, slug, content, featuredImage, status, userId }) {
  const db = loadDb();
  const sessionUser = currentUser(db);
  if (!sessionUser || sessionUser.$id !== userId) {
    throw new Error("Sign in before creating a post.");
  }
  const now = new Date().toISOString();
  const post = {
    $id: slug,
    title: title.trim(),
    content: content || "",
    featuredImage: featuredImage || "",
    status: status || "active",
    userId,
    $createdAt: now,
    $updatedAt: now,
  };
  db.posts.unshift(post);
  saveDb(db);
  return post;
}

export function updatePost(slug, { title, content, featuredImage, status }) {
  const db = loadDb();
  const sessionUser = currentUser(db);
  const index = db.posts.findIndex((item) => item.$id === slug);
  if (index === -1) throw new Error("Post not found.");
  const current = db.posts[index];
  if (!sessionUser || current.userId !== sessionUser.$id) {
    throw new Error("You can only edit your own posts.");
  }
  const next = {
    ...current,
    title: title?.trim() || current.title,
    content: content ?? current.content,
    featuredImage: featuredImage ?? current.featuredImage,
    status: status || current.status,
    $updatedAt: new Date().toISOString(),
  };
  db.posts[index] = next;
  saveDb(db);
  return next;
}

export function deletePost(slug) {
  const db = loadDb();
  const sessionUser = currentUser(db);
  const post = db.posts.find((item) => item.$id === slug);
  if (!post) throw new Error("Post not found.");
  if (!sessionUser || post.userId !== sessionUser.$id) {
    throw new Error("You can only delete your own posts.");
  }
  db.posts = db.posts.filter((item) => item.$id !== slug);
  saveDb(db);
  if (post?.featuredImage) deleteFile(post.featuredImage);
  return true;
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const max = 1280;
      let width = image.width;
      let height = image.height;
      if (width > max) {
        height = Math.round((height * max) / width);
        width = max;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width || 1;
      canvas.height = height || 1;
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    image.src = url;
  });
}

export async function uploadFile(file) {
  if (!file) throw new Error("Choose an image to upload.");
  if (!file.type?.startsWith("image/")) {
    throw new Error("Thumbnail must be an image.");
  }
  const id = uniqueId();
  const dataUrl = await readFile(file);
  localStorage.setItem(fileKey(id), dataUrl);
  return { $id: id };
}

export function deleteFile(fileId) {
  if (!fileId) return false;
  localStorage.removeItem(fileKey(fileId));
  return true;
}

export function getFilePreview(fileId) {
  if (!fileId) return "";
  return localStorage.getItem(fileKey(fileId)) || "";
}
