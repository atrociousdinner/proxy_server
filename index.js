import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3000;

const client = createClient({
    url: process.env.REDIS_URL
})

client.on("error", (err) => console.error("Redis Client Error:", err))

await client.connect();
console.log("Connected to Redis")
    

app.get("/", async (req, res) => {
    await client.set("name", "Nerish")
    const value = await client.get("name")
    res.send(`Value from redis: ${value}`)
});

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
