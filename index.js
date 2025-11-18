#!/usr/bin/env node


import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
import {program} from "commander";

const app = express();

//Redis section
const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("Redis Client Error:", err));

await client.connect();
console.log("Connected to Redis");


//Commander section
program
  .option("-p, --port <number>", "specify the port number of your cache server")
program.parse()

const options = program.opts()
const PORT = options.port || 3000


//Express section
app.get("/", async (req, res) => {
  await client.set("name", "Nerish");
  const value = await client.get("name");
  res.send(`Value from redis: ${value}`);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});



