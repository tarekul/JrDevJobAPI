const fetch = require("node-fetch");
const cheerio = require("cheerio");
const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
const setAsync = promisify(client.set).bind(client);

const baseUrl = "https://jooble.org/api/b8c1c92e-5287-49b7-93d6-af4ff50f028d";

async function fetchJooble() {
  let resultCount = 1;
  let onPage = 0;
  const allJobs = [];

  while (resultCount !== 0 && onPage < 10) {
    const body = {
      keywords: "junior front end developer",
      location: "united states",
      page: onPage,
    };

    const res = await fetch(baseUrl, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const jobsObj = await res.json();
    const jobs = jobsObj.jobs;
    for (let i = 0; i < jobs.length; i++) {
      const desc = await scrapeJobDescription(jobs[i].link);
      jobs[i].created_at = jobs[i].updated;
      jobs[i].description = desc;
    }
    resultCount = jobs.length;
    console.log("got", resultCount, "jobs");
    allJobs.push(...jobs);
    onPage++;
  }

  console.log("total jobs", allJobs.length);

  const jrJobs = allJobs.filter((job) => {
    const jobTitle = job.title.toLowerCase();
    const desc = job.description;
    if (
      jobTitle.includes("senior") ||
      jobTitle.includes("manager") ||
      jobTitle.includes("sr.") ||
      jobTitle.includes("sr") ||
      jobTitle.includes("architect")
    )
      return false;
    else if (
      desc.includes("3-5") ||
      desc.includes("4-5") ||
      desc.includes("5+") ||
      desc.includes("4+") ||
      desc.includes("8-12")
    )
      return false;

    return true;
  });

  console.log("filtered down to ", jrJobs.length);

  //sort the jobs
  jrJobs.sort((a, b) => {
    const a_time = new Date(a.updated);
    const b_time = new Date(b.updated);
    return b_time - a_time;
  });
  const success = await setAsync("jooble", JSON.stringify(jrJobs));

  console.log({ success });
}

async function scrapeJobDescription(url) {
  const res = await fetch(url);
  const html = await res.text();

  let $ = cheerio.load(html);
  let description = $("p, .a708d");
  return description.html();
}

fetchJooble();
module.exports = fetchJooble;
