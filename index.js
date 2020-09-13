const express = require("express");
const app = express();
const port = process.env.PORT || 3002;

var CronJob = require("cron").CronJob;
const fetchGithub = require("./fetch-github");

//const { promisify } = require("util");
// var redis = require("redis");
// var client = redis.createClient();

let githubJobs;

const job = new CronJob(
  "* * * * *",
  () => {
    fetchGithub().then((res) => (githubJobs = res));
  },
  null,
  true,
  "America/New_York"
);

job.start();

//const getAsync = promisify(client.get).bind(client);

app.get("/jobs", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  //const gJobs = JSON.parse(await getAsync("github"));
  //return res.send(gJobs);

  if (!githubJobs) githubJobs = await fetchGithub();

  res.json(githubJobs);
});
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
