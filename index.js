#!/usr/bin/env node

import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
import { program } from "commander";
import axios from "axios";



//Global variables
const app = express();


const fetchApiData = async (url, route) => {
  try {
    const full_url = url + route
    console.log(full_url)
    const response = await fetch(full_url)
    const data = await response.json()
    console.log(`Request sent to the API`)
    console.log(data)
  }
  catch (err) {
    console.error(`Cannot fetch API: `, err)
  }
}

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
  .option("-o, --origin <url>", "specify the server to request")
program.parse()

const options = program.opts()
const PORT = options.port || 3000
const server_url = options.origin


//Express section
// app.use('*', (req, res, next) => {
//   const endpoint = req.path;       // /api/products
//   const fullUrl = req.originalUrl; // /api/products?limit=10
//   const method = req.method;       // GET, POST, PUT, etc.

//   console.log('Method:', method);
//   console.log('Endpoint:', endpoint);
//   console.log('Full URL:', fullUrl);

//   next(); // continue to route handler
// });


app.use(async (req, res) => {
  const route = req.originalUrl
  const method = req.method
  // const fullUrl = req.fullUrl

  console.log('Method:', method);
  // console.log('Full URL:', fullUrl);
  await fetchApiData(server_url, route)
});

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}. Forward request to ${server_url}`);
});



