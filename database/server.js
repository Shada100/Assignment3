const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const taskRoutes = require("../routes/task"); // Task routes
const userRoutes = require("../routes/user"); // User routes

// Constants
const PORT = 5501;
const MONGO_URI =
  "mongodb+srv://shadafunmi421:P6iCaCfKNOxkZ7v4@apicluster.z36wa.mongodb.net/?retryWrites=true&w=majority&appName=apicluster";

const app = express();

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected and Server running on http://localhost:${PORT}`);
});

app.use(cors());

// Initialize Passport and Session handling
app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Body-parser for POST requests
//app.use(bodyParser.json());

app.use(express.static("partials"));

// Use user and task routes
app.use("/user", userRoutes); // User routes (signup/login)
app.use("/tasks", taskRoutes); // Task routes (get, post, patch, delete)

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
