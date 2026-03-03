const express = require("express");
const { WebcastPushConnection } = require("tiktok-live-connector");
const WebSocket = require("ws");

const app = express();
const server = app.listen(process.env.PORT || 3000);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
});

const tiktokUsername = "serhatky0";

const tiktok = new WebcastPushConnection(tiktokUsername);

tiktok.connect().then(() => {
  console.log("TikTok connected!");
}).catch(err => console.error(err));

tiktok.on("chat", data => {
  const comment = data.comment.toLowerCase();

  if (comment.length === 5) {
    clients.forEach(ws => {
      ws.send(comment);
    });
  }
});

app.get("/", (req, res) => {
  res.send("Bot çalışıyor 🚀");
});
