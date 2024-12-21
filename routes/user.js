const express = require("express");
const router = express.Router();
const passport = require("./passport.js"); // Import the Passport
const User = require("../models/user.js");

// Sign Up Route (GET
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Sign Up Route (POST)
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  User.create({ username, password })
    .then((user) => {
      // Automatically log in the user after successful signup
      req.login(user, (err) => {
        if (err) {
          return res.redirect("/signup");
        }
        res.redirect("/tasks"); // Redirect to tasks after sign up
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(400).send("Username already exists");
      } else {
        res.status(500).send("Error signing up");
      }
    });
});

// Login Route (GET)
router.get("/login", (req, res) => {
  res.render("login");
});

// Login Route (POST) using Passport's LocalStrategy
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/tasks", // Redirect to tasks after successful login
    failureRedirect: "/login", // Redirect back to login if authentication fails
    failureFlash: true, // Optionally use flash messages for failed login
  })
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
