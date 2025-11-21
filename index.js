#!/usr/bin/env node
import redisConfig from "./redisConfig.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { proxy_command } from "./command.js";
import { cacheData } from "./helpers/cacheData.js";
import { fetchApiData } from "./helpers/fetchData.js";

//Global variables
const app = express();

//Redis section
await redisConfig.connect();

//commander
const { PORT, server_url } = await proxy_command();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//If its an old request, send the cached data.
app.use(cacheData);

// If its not cached, go through this middleware
app.use(async (req, res) => {
  const route = req.originalUrl;
  const method = req.method;
  const headers = req.headers;
  const data = req.body;
  const url = server_url + route;

  console.log(url);
  console.log("Method:", method);

  const result = await fetchApiData({ method, url, headers, data });

  //Cache the data since its a first-time request
  if (result.status >= 200 && result.status < 300) {
    await redisConfig.set(url, JSON.stringify(result), {
      EX: 1800,
      NX: true,
    });
  }
  res.setHeader("X-Cache", "MISS");
  res.status(result.status).send({
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
