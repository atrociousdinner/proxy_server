#!/usr/bin/env node

import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
import { program } from "commander";
import axios from "axios";

//Global variables
const app = express();

const fetchApiData = async ({ method, url, headers, body }) => {
  const axiosConfig = {
    method,
    url,
    headers: { ...headers, host: undefined },
    data: body,
    validateStatus: () => true,
  };

  try {
    const response = await axios(axiosConfig);
    console.log(`Request sent to the API`);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (err) {
    console.error(`Cannot fetch API: `, err);
    return {
      status: 502,
      data: { error: "Proxy Error" },
    };
  }
};

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
  .option("-o, --origin <url>", "specify the server to request");
program.parse();

const options = program.opts();
const PORT = options.port || 3000;
let server_url = options.origin;
if (!server_url.includes("https://")) {
  server_url = "https://" + server_url;
}

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cacheData = async (req, res, next) => {
  const url = server_url + req.originalUrl;
  try {
    const cacheResult = await client.get(url);
    // console.log('The cache result: ', cacheResult)
    // console.log('The cache type: ', typeof(cacheResult))
    if (cacheResult) {
      const result = JSON.parse(cacheResult);
      res.setHeader("X-Cache", "HIT");
      res.send({
        fromCache: true,
        data: result.data,
        status: result.status,
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Cache Error");
  }
};

app.use(cacheData);
app.use(async (req, res) => {
  const route = req.originalUrl;
  const method = req.method;
  const headers = req.headers;
  const data = req.body;

  const url = server_url + route;
  console.log(url);

  console.log("Method:", method);
  const result = await fetchApiData({ method, url, headers, data });

  await client.set(url, JSON.stringify(result), {
    EX: 1800,
    NX: true,
  });

  // console.log(result.data);
  res.setHeader("X-Cache", "MISS");
  res.send({
    fromCache: false,
    data: result.data,
    status: result.status,
  });
});

app.listen(PORT, () => {
  console.log(
    `App listening on PORT: ${PORT}. Forward request to ${server_url}`
  );
});
