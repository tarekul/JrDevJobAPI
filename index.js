const express = require("express");
const app = express();
const port = process.env.PORT || 3002;

// const { promisify } = require("util");
// var redis = require("redis");
// var client = redis.createClient();

// const { job } = require("./worker/worker.js");
// job.start();

// const getAsync = promisify(client.get).bind(client);

app.get("/jobs", async (req, res) => {
  // const gJobs = JSON.parse(await getAsync("github"));
  // //const jJobs = JSON.parse(await getAsync("jooble"));
  // res.header("Access-Control-Allow-Origin", "*");
  // return res.send(gJobs);
  res.send("hi");
});
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
