// allRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET Requests
router.get("/", userController.user_index_get);
router.get("/edit/:id", userController.user_edit_get);
router.get("/view/:id", userController.user_view_get);

// POST Request for Search
router.post("/search", userController.user_search_post);

// DELETE Request
router.delete("/edit/:id", userController.user_delete);

// PUT Request
router.put("/edit/:id", userController.user_put);

module.exports = router;
