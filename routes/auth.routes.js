const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Lifehack = require("../models/Lifehack.model");

// GET /signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /signup
router.post("/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  //   ! This regular expression checks password for special characters and minimum length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }
  */

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, password: hashedPassword });
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /login
router.get("/login", isLoggedOut, (req, res) => {
  
  res.render("auth/login",{userInSession: req.session.currentUser});
});

// POST /login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((error) => next(error)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((error) => next(error));
});

// GET /logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).render("auth/logout", { errorMessage: error.message });
      return;
    }

    res.redirect("/");
  });
});

// GET /profile
router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  const userId = req.session.currentUser._id;
  const data = {};
  
  Lifehack.find({author: userId})
  .then(lifehacksPosted=>{
    data.lifehacksPosted = lifehacksPosted;
    
    return User.aggregate([ 
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId)
        },
      },
      {
        $lookup: {
          from: "lifehacks",
          localField: "postsLiked",
          foreignField: "_id",
          as: "lookup_LH_likes",
        },
      },
      {
        $unwind: "$lookup_LH_likes"
      },
      {
        $group: {
          "_id": "$lookup_LH_likes._id",
          "embedMultimediaLike": {
            "$first": "$lookup_LH_likes.embedMultimedia"
          },
          "titleLike": {
            "$first": "$lookup_LH_likes.title"
          },
          "postsLiked": {
            "$first": "$postsLiked"
          }
        }
      },
    ])
  })
  .then(result => {
    data.lifehacksLiked = result;
    res.render("users/user-profile", data);
    
  })
  .catch((error) => {
    console.log(`There was an error in the profile page => ${error}`);
    next(error);
  });
  
});

module.exports = router;