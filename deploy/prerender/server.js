const prerender = require("prerender");
const memoryCache = require("prerender-memory-cache");

const server = prerender({
  chromeLocation: "/usr/bin/google-chrome-stable",
  chromeFlags: [
    "--no-sandbox",
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--hide-scrollbars",
  ],
  port: Number(process.env.PORT) || 3000,
  logRequests: process.env.LOG_REQUESTS === "1",
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
server.use(memoryCache);

server.start();
