const express = require("express");

const actionsRouter = require("./actions/actionsRouter");
const projectsRouter = require("./projects/projectsRouter");
const server = express();

server.use(express.json());
server.use(logger);
server.use("/actions", actionsRouter);
server.use("/projects", projectsRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Projects and Actions API</h2>`);
});

//logger middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get(
      "host"
    )}`
  );
  next();
}

module.exports = server;
