const router = require("express").Router();
const Tag = require("../models/Tag.model");
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model");
const isLoggedIn = require('../middleware/isLoggedIn');

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

/* Create a Tag */
// GET route to display the form
router.get('/tags/create', (req, res) => {
    res.render("tags/tag-create");
});
// POST route to save a new tag to the database in the tags collection
router.post('/tags/create', fileUploader.single('img'), (req, res, next) => {
    const { name, img } = req.body;
    const imgFilePath = req.file.path;
    console.log(imgFilePath);
    Tag.create({ name, img: imgFilePath })
        .then(() => res.redirect('/tags'))
        .catch(error => {
            console.log("Error creating a new Tag in DB", error);
            next(error);
        });
});

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
  const objectId = req.params.tagId;
  let tagObject = null;
  Tag.findById(objectId)
    .then((response) => {
      tagObject = response;
      return Lifehack.find({ tags: objectId }).populate("tags");
    })
    .then((allLH) => {
      res.render("lifehacks/lifehacks-list", {
        allLH,
        fromTaglist: true,
        tagObject,
      });
    })
    .catch((error) => {
      console.log("Error while searching for All Lifehacks by tag: ", error);
      next(error);
    });
});

/* POST route to delete a TAG from the database */
router.post("/tags/:tagId/delete", (req, res, next) => {
  const { tagId } = req.params;

  Tag.findByIdAndDelete(tagId)
    .then(() => res.redirect("/tags"))
    .catch((error) => {
      console.log("Error deleting a TAG from DB", error);
      next();
    });
});

module.exports = router