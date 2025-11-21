import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("Redis Client Error:", err));

const connect = async () => { await client.connect() }
const get = async (key) => client.get(key)
const set = async (key, value, options) => client.set(key, value, options)
const clear = async () => client.flushDb()

export default {connect, get, set, clear}

