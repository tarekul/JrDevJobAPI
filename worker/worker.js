var CronJob = require("cron").CronJob;
const fetchGithub = require("./tasks/fetch-github");
//const fetchJooble = require("./tasks/fetch-jooble");

const job = new CronJob(
  "0 * * * *",
  fetchGithub,
  null,
  true,
  "America/New_York"
);
//var job2 = new CronJob("0 * * * *", fetchJooble, null, true, "America/New");

module.exports = { job };
//job.start();
//job2.start();
