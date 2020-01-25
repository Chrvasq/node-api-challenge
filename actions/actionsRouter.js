const express = require("express");

const Actions = require("./actionModel");
const Projects = require("../projects/projectModel");
const router = express.Router();

// GET all actions
router.get("/", (req, res) => {
  Actions.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      console.log("Error:", err);
      res.status(500).json({ message: "Actions data could not be retrieved." });
    });
});

// GET action by ID
router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

// PUT (Update) action
router.put("/:id", validateActionId, (req, res) => {
  const { id } = req.action;
  const changes = req.body;
  const { description, notes } = changes;

  description && notes
    ? Actions.update(id, changes)
        .then(action => res.status(200).json(action))
        .catch(err => {
          console.log("Error: ", err);
          res.status(500).json({ message: "Exception", err });
        })
    : res
        .status(400)
        .json({ errorMessage: "Must provide description and notes." });
});

// DELETE action
router.delete("/:id", validateActionId, (req, res) => {
  const action = req.action;
  const { id } = action;

  Actions.remove(id)
    .then(() => res.status(200).json(action))
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// custom middleware

function validateActionId(req, res, next) {
  const { id } = req.params;

  Actions.get(id)
    .then(action => {
      action
        ? ((req.action = action), next())
        : res.status(404).json({ message: "Action does not exist." });
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
}

module.exports = router;
