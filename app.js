const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const path = require("path");
const moment = require("moment"); // Moment.js for date formatting

// Import the model
const User = require("./models/customerSchema");

// Initialize app and set the port
const app = express();
const port =process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(methodOverride("_method")); // Support for PUT and DELETE methods
app.set("view engine", "ejs"); // Set EJS as the template engine
app.use(express.static("public")); // Serve static files from the "public" folder

// Livereload setup for auto-refreshing the browser during development
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public")); // Watch the "public" directory
app.use(connectLivereload()); // Connect livereload middleware

liveReloadServer.server.once("connection", () => {
  console.log("LiveReload server connected");
  setTimeout(() => {
    liveReloadServer.refresh("/"); // Refresh the browser
  }, 100);
});

// ========= GET REQUESTS ==========

// Home route to fetch and display all users
app.get("/", (req, res) => {
  console.log("===============================");
  User.find()
    .then((result) => {
      console.log(result);
      res.render("index", { arr: result, moment: moment }); // Pass users and moment.js to the view
    })
    .catch((err) => {
      console.log(err);
    });
});

// Render the "add user" form
app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

// Render the "edit user" form by ID
app.get("/edit/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Render the "view user" page by ID
app.get("/view/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

// ========= POST REQUESTS ==========

// Add a new user
app.post("/user/add.html", (req, res) => {
  User.create(req.body) // Save the user to the database
    .then(() => {
      res.redirect("/"); // Redirect to the homepage
    })
    .catch((err) => {
      console.log(err);
    });
});

// Search for users
app.post("/search", (req, res) => {
  console.log("*******************************");

  const searchText = req.body.searchText.trim();
  User.find({ $or: [{ firstName: searchText }, { lastName: searchText }] })
    .then((result) => {
      console.log(result);
      res.render("user/search", { arr: result, moment: moment }); // Render search results
    })
    .catch((err) => {
      console.log(err);
    });
});

// ========= PUT REQUESTS ==========

// Update user information by ID
app.put("/edit/:id", (req, res) => {
  console.log("**********************************************");
  User.findByIdAndUpdate(req.params.id.trim(), req.body) // Update user data
    .then(() => {
      res.redirect("/"); // Redirect to the homepage
    })
    .catch((err) => {
      console.log(err);
    });
});

// ========= DELETE REQUESTS ==========

// Delete a user by ID
app.delete("/edit/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id.trim()) // Delete the user
    .then(() => {
      res.redirect("/"); // Redirect to the homepage
    })
    .catch((err) => {
      console.log(err);
    });
});

// ========= MONGODB CONNECTION ==========

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MONGODB_URI is required. Set it in the environment before starting the server.");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at: http://localhost:${port}/`);
    });
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
