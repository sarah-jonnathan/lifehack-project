const router = require("express").Router();
const Tag = require("../models/Tag.model");
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model");

//READ: List all tags
router.get("/tags", (req, res, next) => {
    Tag.find()
        .then(tags => {
            res.render("tags/tags-list", { tags });
        })
        .catch(err => {
            console.log('Error getting tags from DB...', err);
            next(err);
        })
});

// List all LH with a specific tag
router.get("/tags/:tagId", (req, res, next) => {
    const ObjectId = req.params.tagId;
    Lifehack.find({tags: ObjectId})
      .then((allLH) => {
        res.render("tags/lifehacks", {allLH});
      })
      .catch(error => {
        console.log("Error while searching for All Lifehacks by tag: ", error);
        next(error);
      });
  });

module.exports = router