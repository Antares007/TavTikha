const http = require("http");
const fs = require("fs");
const assets = fs
  .readdirSync("assets")
  .reduce((a, b) => ((a["/" + b.toLowerCase()] = 1), a), {});
const html_headers = {
  "Content-Type": "text/html",
};
const css_headers = {
  "Content-Type": "text/css",
};
const pages = {
  "/": "./index.html",
  "/about": "./about.html",
  "/home": "./index.html",
  "/contact": "./contact.html",
  "/thank_you": "./thank_you.html",
};
const server = http.createServer((req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const referer = req.headers["referer"] || req.headers["referrer"];
  console.log(
    `${req.url}\0${ip}\0${userAgent}\0${referer}`
  );
  if (pages[req.url])
    res.writeHead(200, html_headers),
      fs.createReadStream(pages[req.url]).pipe(res);
  else if (req.url === "/style.css")
    res.writeHead(200, css_headers),
      fs.createReadStream("./style.css").pipe(res);
  else if (assets[req.url]) fs.createReadStream("./assets" + req.url).pipe(res);
  else if (req.url === "/submit")
    req
      .take(1)
      .on("data", (chunk) => console.log(chunk.slice(0, 202).toString()))
      .on(
        "end",
        () => (res.writeHead(301, { Location: "/thank_you" }), res.end())
      );
  else fs.createReadStream("./404.html").pipe(res);
});
const port = 7000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
