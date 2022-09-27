import { client } from '../db.js';

export const user = client.db("auth").collection("user")

user.createIndex({"email.address": 1})