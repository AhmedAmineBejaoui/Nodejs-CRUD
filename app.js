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



// const app = express();
// const port = 3001;
// const mongoose = require("mongoose");
// app.use(express.urlencoded({ extended: true }));
// //const User = require("./models/customerSchema");
// app.set("view engine", "ejs");
// app.use(express.static("public"));
// var moment = require("moment");
// var methodOverride = require("method-override");
// app.use(methodOverride("_method"));

// // Auto refresh
// const path = require("path");
// const livereload = require("livereload");
// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(__dirname, "public"));

// const connectLivereload = require("connect-livereload");
// app.use(connectLivereload());

// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

// // GET Requst
// app.get("/", (req, res) => {
//   // result ==> array of objects
//   console.log("--------------------------------------------");
//   User.find()
//     .then((result) => {
//       res.render("index", { arr: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.get("/user/add.html", (req, res) => {
//   res.render("user/add");
// });

// app.get("/edit/:id", (req, res) => {
//   User.findById(req.params.id)
//     .then((result) => {
//       res.render("user/edit", { obj: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.get("/view/:id", (req, res) => {
//   // result ==> object
//   User.findById(req.params.id)
//     .then((result) => {
//       res.render("user/view", { obj: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // POST Requst
// app.post("/user/add.html", (req, res) => {
//   User.create(req.body)
//     .then(() => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.post("/search", (req, res) => {
//   console.log("*******************************");
 
//   const searchText = req.body.searchText.trim()

//   User.find({ $or: [{ fireName: searchText }, { lastName: searchText }] })
//     .then((result) => {
//       console.log(result);
//       res.render("user/search", { arr: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

















// // DELETE Request
// app.delete("/edit/:id", (req, res) => {
//   User.deleteOne({ _id: req.params.id })
//     .then((result) => {
//       res.redirect("/");
//       console.log(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // PUT Requst
// app.put("/edit/:id", (req, res) => {
//   User.updateOne({ _id: req.params.id }, req.body)
//     .then((result) => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });


// const express = require("express");
// const app = express();
// const port = 3000;
// const mongoose = require("mongoose");
// const path = require("path");
// const livereload = require("livereload");
// const connectLivereload = require("connect-livereload");
// var moment = require("moment"); // require
// moment().format();
// var methodOverride = require("method-override");
// app.use(methodOverride("_method"));

// app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.use(express.static("public"));

// // Import the model
// const User = require("./models/customerSchema");

// // Set up LiveReload middleware
// app.use(connectLivereload());

// // Create a LiveReload server
// const liveReloadServer = livereload.createServer();

// // Watch the public directory for changes
// liveReloadServer.watch(path.join(__dirname, "public"));

// // Refresh the browser after a connection
// liveReloadServer.server.once("connection", () => {
//   console.log("LiveReload server connected");
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

// //========= GET REQUEST ===========

// app.get("/", (req, res) => {
//   console.log("===============================");
//   User.find()
//     .then((result) => {
//       console.log(result);
//       res.render("index", { arr: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.get("/", (req, res) => {
//   res.render("index", {});
// });

// // Route for form submission
// app.get("/user/add.html", (req, res) => {
//   res.render("user/add");
// });

// app.get("/edit/:id", (req, res) => {
//   User.findById(req.params.id)
//     .then((result) => {
//       res.render("user/edit", { object: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.get("/view/:id", (req, res) => {
//   User.findById(req.params.id)
//     .then((result) => {
//       res.render("user/view", { object: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });



// // =========== POST REQUEST ===========

// app.post("/user/add.html", (req, res) => {
//   User.create(req.body) //like saving data to database
//     .then((result) => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });


// app.post("/search", (req, res) => {
//   console.log("*******************************");
 
//   const searchText = req.body.searchText.trim()

//   User.find({ $or: [{ fireName: searchText }, { lastName: searchText }] })
//     .then((result) => {
//       console.log(result);
//       res.render("user/search", { arr: result, moment: moment });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });






// ///edit/ <%= object._id %>
// // =========== PUT REQUEST ===========

// // =========== DELETE REQUEST ===========

// app.delete("/edit/:id", (req, res) => {
//   User.findByIdAndDelete(req.params.id.trim()) // ou bien avec User.deleteOne({ _id: req.params.id })
//     .then((result) => {
//       console.log(result);
//       res.redirect("/", { object: result });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// ///edit/ <%= object._id %>
// // =========== PUT REQUEST ===========

// app.put("/edit/:id", (req, res) => {
//   console.log("**********************************************");
//   User.findByIdAndUpdate(req.params.id.trim(), req.body) // updateOne({ _id: req.params.id }, req.body)
//     .then((result) => {
//       console.log(result);
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // MongoDB connection
// mongoose
//   .connect(
//     "mongodb+srv://bejaouiahmed053:aj6TvCOCB4bUh2Iq@crud.uyfxo.mongodb.net/all-data?retryWrites=true&w=majority&appName=CRUD"
//   )
//   .then(() => {
//     // Start the server
//     app.listen(port, () => {
//       console.log(`http://localhost:${port}/`);
//     });
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => console.log("Error while connecting to MongoDB", err));
