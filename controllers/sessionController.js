const User = require("../models/User");
const parseValidationErrors = require("../utils/parseValidationErrors");

const registerShow = (req, res, next) => {
  // Simply render the register form
  res.render("register");
};

const registerDo = async (req, res, next) => {
  // Check if the passwords match
  if (req.body.password !== req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { errors: req.flash("error") });
  }

  try {
    // Create a new user in the database
    await User.create(req.body);
  } catch (e) {
    // Handle Mongoose validation errors
    if (e.constructor.name === "ValidationError") {
      parseValidationErrors(e, req); // Parse validation errors and add to flash
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      // Handle duplicate email case (e.g. email already exists)
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e); // Any other error, pass to error handler
    }

    // If there are errors, re-render the registration form with the error messages
    return res.render("register", { errors: req.flash("error") });
  }

  // Redirect to home page if user is successfully created
  res.redirect("/");
};

const logoff = (req, res) => {
  // Log off the user and destroy the session
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/"); // Redirect to the home page
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    // If the user is already logged in, redirect to home
    return res.redirect("/");
  }
  // Show the login page with potential errors or info
  res.render("logon");
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
