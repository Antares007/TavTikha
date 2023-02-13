const http = require("http");
const fs = require("fs");
const assets = fs
  .readdirSync("assets")
  .reduce((a, b) => ((a["/" + b.toLowerCase()] = 1), a), {});
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("./index2.html").pipe(res);
  } else if (assets[req.url]) {
    fs.createReadStream("./assets" + req.url).pipe(res);
  }
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
