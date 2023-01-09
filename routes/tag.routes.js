const router = require("express").Router();
const Tag = require("../models/Tag.model");
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin")

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

/* Create a Tag */
// GET route to display the form
router.get('/tags/create', isAdmin, (req, res) => {
    res.render("tags/tag-create");
});
// POST route to save a new tag to the database in the tags collection
router.post('/tags/create', isAdmin, fileUploader.single('img'), (req, res, next) => {
    const { name, img } = req.body;
    const imgFilePath = req.file.path;
    Tag.create({ name, img: imgFilePath })
        .then(() => res.redirect('/tags'))
        .catch(error => {
            console.log("Error creating a new Tag in DB", error);
            next(error);
        });
});

//READ: List all tags
router.get("/tags", isAdmin, (req, res, next) => {
    if (req.session.currentUser.isAdmin === true) {
      const is_admin = true;
    }
    Tag.find()
        .then(tags => {
            res.render("tags/tags-list", { tags });
        })
        .catch(error => {
            console.log('Error getting tags from DB...', error);
            next(error);
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

// GET: Display TAG edit form
router.get("/tags/:tagId/edit", isAdmin, (req, res, next) => {
  const tagId = req.params.tagId;
  const data = {};
  Lifehack.find({ tags: tagId })
    .then((lifehack) => {
      data.lifehack = lifehack;
      
      if (data.lifehack.length > 0) {
        res.locals.warning = "There are LH's in DB associated to this Tag. Deleting this Tag might not be a good idea.";
      } else {
        res.locals.warning = "There are no LH's in DB associated to this Tag."
      }
      return Tag.findById(tagId);      
    })
    .then((tagDetails) => {
      data.tagDetails = tagDetails;
      res.render("tags/tag-edit", data);
    })
    .catch((error) => {
      console.log("Error trying to get tag to edit", error);
    });
});

// POST: Update Tag details in DB
router.post("/tags/:tagId/edit", isAdmin, fileUploader.single('img'), (req, res, next) => {
  const tagId = req.params.tagId;
  const { name, img } = req.body;
  if (!img) {
    Tag.findByIdAndUpdate(tagId, {name })
    .then(() => res.redirect(`/tags`))
    .catch((error) => {
      console.log("Error updating Tag", error);
    });
  } else {
    const imgFilePath = req.file.path;
    Tag.findByIdAndUpdate(tagId, {name, img: imgFilePath })
    .then(() => res.redirect(`/tags`))
    .catch((error) => {
      console.log("Error updating Tag", error);
    });
  }
});

/* POST route to delete a TAG from the database */
router.post("/tags/:tagId/delete", isAdmin, (req, res, next) => {
  const { tagId } = req.params;

  Tag.findByIdAndDelete(tagId)
    .then(() => res.redirect("/tags"))
    .catch((error) => {
      console.log("Error deleting a TAG from DB", error);
      next();
    });
});

module.exports = router