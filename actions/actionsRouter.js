const express = require("express");

const Actions = require("./actionModel");
const router = express.Router();

// GET all actions
router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).json({ message: "Actions data could not be retrieved." });
    });
});

module.exports = router;
