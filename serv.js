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
};
const server = http.createServer((req, res) => {
  if (pages[req.url])
    res.writeHead(200, html_headers),
      fs.createReadStream(pages[req.url]).pipe(res);
  else if (req.url === "/style.css")
    res.writeHead(200, css_headers),
      fs.createReadStream("./style.css").pipe(res);
  else if (assets[req.url]) fs.createReadStream("./assets" + req.url).pipe(res);
  else fs.createReadStream("./404.html").pipe(res);
});

const port = 7000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
const axios = require("axios");
async function checkBalance(address) {
  try {
    const response = await axios.get(
      `https://api.blockcypher.com/v1/btc/main/addrs/${address}`
    );
    const balance = response.data.balance;
    console.log(`The balance of address ${address} is ${balance} satoshis.`);
  } catch (error) {
    console.error(
      `An error occurred while checking the balance of address ${address}: ${error.message}`
    );
  }
}
