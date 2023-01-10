const express = require('express');
const router = express.Router();
// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Lifehack = require('../models/Lifehack.model');


// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  const sampleOfLifehacks=3
  Lifehack.aggregate([
    {$sample: {size: sampleOfLifehacks}},
    {
      $lookup:{
        from:"tags",
        localField:"tags",
        foreignField:"_id",
        as:"tags",
      },
    }
  ]).exec()
    .then(randomLifehacksArray=>{
      console.log(`how many lifehacks are we getting?`,randomLifehacksArray.length)
      res.render("index", {
        userInSession: req.session.currentUser,
        randomLifehacksArray:randomLifehacksArray
      });
      
    })
    .catch(error=>{
      console.log(`there has been an error getting the homepage==>${error}`)
      next(error)
    })
});

module.exports = router;
