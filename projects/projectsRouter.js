const express = require("express");

const Projects = require("./projectModel");
const Actions = require("../actions/actionModel");
const router = express.Router();

// GET all projects
router.get("/", (req, res) => {
  Projects.get()
    .then(projects => res.status(200).json(projects))
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// GET project by ID
router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

// POST project
router.post("/", validateProject, (req, res) => {
  const newProject = { name: req.name, description: req.description };

  Projects.insert(newProject)
    .then(project => res.status(201).json(project))
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// PUT (Update) project
router.put("/:id", validateProjectId, validateProject, (req, res) => {
  const changes = {
    name: req.name,
    description: req.description,
    completed: req.body.completed
  };

  const { id } = req.project;

  Projects.update(id, changes)
    .then(project => res.status(200).json(project))
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// DELETE project
router.delete("/:id", validateProjectId, (req, res) => {
  const project = req.project;
  const { id } = project;

  Projects.remove(id)
    .then(() => res.status(200).json(project))
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// GET all actions by project ID
router.get("/:id/actions", validateProjectId, (req, res) => {
  const { id } = req.project;

  Projects.getProjectActions(id)
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// POST action
router.post("/:id/actions", validateProjectId, validateAction, (req, res) => {
  const newAction = {
    description: req.description,
    notes: req.notes,
    project_id: req.project.id
  };

  Actions.insert(newAction)
    .then(action => res.status(201).json(action))
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// custom middleware
function validateProjectId(req, res, next) {
  const { id } = req.params;

  Projects.get(id)
    .then(project => {
      project
        ? ((req.project = project), next())
        : res.status(404).json({ message: "Project does not exist." });
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
}

function validateAction(req, res, next) {
  const body = Object.keys(req.body).length === 0 ? 0 : 1;
  const { description, notes } = req.body;

  body
    ? !description || !notes
      ? res.status(400).json({
          errorMessage: "Missing required description and notes fields."
        })
      : ((req.description = description), (req.notes = notes), next())
    : res.status(500).json({ errorMessage: "Missing action data." });
}

function validateProject(req, res, next) {
  const body = Object.keys(req.body).length === 0 ? 0 : 1;
  const { name, description } = req.body;

  body
    ? !name || !description
      ? res.status(400).json({
          errorMessage: "Missing required name and description fields."
        })
      : ((req.name = name), (req.description = description), next())
    : res.status(500).json({ errorMessage: "Missing project data." });
}

module.exports = router;
