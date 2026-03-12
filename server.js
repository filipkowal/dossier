const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
};

app.prepare().then(() => {
  const hostname = dev ? "127.0.0.1" : "digitalent.cloud";
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, hostname, (err) => {
    if (err) throw err;
    const localHostLabel = dev ? "digitalent.cloud" : hostname;
    console.log(`> Server listening on https://${localHostLabel}:3000`);
    if (dev) {
      console.log(`> IMPORTANT: Please ensure you have added '127.0.0.1 digitalent.cloud' to your /etc/hosts file.`);
    }
  });
});
