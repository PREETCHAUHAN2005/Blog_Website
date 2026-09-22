import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import { resolveMode } from "./mode.js";
import { makeSlug } from "./slug.js";
import * as local from "./local.js";

export class Services {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, content, featuredImage, status, userId }, attempt = 0) {
    const payload = {
      title: String(title || "").trim(),
      content: content || "",
      featuredImage: featuredImage || "",
      status: status === "inactive" ? "inactive" : "active",
      userId,
    };
    if (!payload.title) throw new Error("Title is required.");
    if (!payload.userId) throw new Error("Sign in before creating a post.");

    if ((await resolveMode()) === "local") {
      return local.createPost({ ...payload, slug: makeSlug(payload.title) });
    }

    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        makeSlug(payload.title),
        payload
      );
    } catch (error) {
      if (error?.code === 409 && attempt < 2) {
        return this.createPost(payload, attempt + 1);
      }
      console.error("Appwrite service :: createPost :: error", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    const payload = {
      title: String(title || "").trim(),
      content: content || "",
      featuredImage: featuredImage || "",
      status: status === "inactive" ? "inactive" : "active",
    };
    if (!slug) throw new Error("Missing post id.");
    if (!payload.title) throw new Error("Title is required.");

    if ((await resolveMode()) === "local") return local.updatePost(slug, payload);

    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        payload
      );
    } catch (error) {
      console.error("Appwrite service :: updatePost :: error", error);
      throw error;
    }
  }

  async deletePost(slug) {
    const existing = await this.getPost(slug).catch(() => null);
    if ((await resolveMode()) === "local") return local.deletePost(slug);
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      if (existing?.featuredImage) await this.deleteFile(existing.featuredImage);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePost :: error", error);
      throw error;
    }
  }

  async getPost(slug) {
    if ((await resolveMode()) === "local") return local.getPost(slug);
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.error("Appwrite service :: getPost :: error", error);
      throw error;
    }
  }

  async getPosts(filter = {}) {
    if ((await resolveMode()) === "local") return local.getPosts(filter);

    const queries = [];
    if (filter.status) queries.push(Query.equal("status", filter.status));
    if (filter.userId) queries.push(Query.equal("userId", filter.userId));

    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      const missingIndex =
        error?.code === 400 && /index/i.test(String(error?.message || ""));
      if (!missingIndex) {
        console.error("Appwrite service :: getPosts :: error", error);
        throw error;
      }
      const all = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
      const documents = (all.documents || []).filter((doc) => {
        if (filter.status && doc.status !== filter.status) return false;
        if (filter.userId && doc.userId !== filter.userId) return false;
        return true;
      });
      return { ...all, documents, total: documents.length };
    }
  }

  async uploadFile(file) {
    if (!file) throw new Error("Choose an image to upload.");
    if ((await resolveMode()) === "local") return local.uploadFile(file);
    try {
      return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file);
    } catch (error) {
      console.error("Appwrite service :: uploadFile :: error", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    if (!fileId) return false;
    if (local.getFilePreview(fileId)) return local.deleteFile(fileId);
    if ((await resolveMode()) === "local") return local.deleteFile(fileId);
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    if (!fileId) return "";
    const saved = local.getFilePreview(fileId);
    if (saved) return saved;
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }
}

const service = new Services();
export default service;
