import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";
import { resolveMode } from "./mode.js";
import * as local from "./local.js";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    if ((await resolveMode()) === "local") {
      return local.createAccount({ email, password, name });
    }
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name
    );
    if (userAccount) return this.login({ email, password });
    return userAccount;
  }

  async login({ email, password }) {
    if ((await resolveMode()) === "local") {
      return local.login({ email, password });
    }
    return this.account.createEmailPasswordSession(email, password);
  }

  async getCurrentUser() {
    if ((await resolveMode()) === "local") return local.getCurrentUser();
    try {
      return await this.account.get();
    } catch (error) {
      if (error?.code === 401) return null;
      console.error("Appwrite service :: getCurrentUser :: error", error);
      return null;
    }
  }

  async logout() {
    if ((await resolveMode()) === "local") return local.logout();
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      if (error?.code !== 401) {
        console.error("Appwrite service :: logout :: error", error);
      }
    }
  }
}

const authService = new AuthService();
export default authService;
