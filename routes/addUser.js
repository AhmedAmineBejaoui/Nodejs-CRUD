const express = require("express");
const router = express.Router();
const path = require("path");

// Render Add User Page
router.get("/add", (req, res) => {
    res.render("/user/add"); // Renders views/user/add.ejs
});

// Handle Add User Form Submission
router.post("/add", (req, res) => {
    // Add your logic to handle form data
    res.send("User added successfully!");
});

module.exports = router;
