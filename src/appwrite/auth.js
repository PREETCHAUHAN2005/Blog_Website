// import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint('https://nyc.cloud.appwrite.io/v1')
      .setProject('689b279c000047cd929c');
    this.account = new Account(this.client);
  }
  async createAccount({ email, password, name }) {
    // try{
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name
    );
    if (userAccount) {
      // call ANOTHER Method
      return this.login({ email, password });
    } else {
      return userAccount;
    }
 
  }
  async login({ email, password }) {
    return await this.account.createEmailPasswordSession(email, password);
  }
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite Service :: getCurrentUser :: error", error);
    }
    return null;
  }
  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite Service :: getCurrentUser :: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
