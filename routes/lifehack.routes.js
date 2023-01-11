const router = require("express").Router();
const app =require("../app")
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model")
const Tag = require("../models/Tag.model")

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');
const cloudinary = require('cloudinary').v2;

//require middleware functions
const isLoggedIn = require("../middleware/isLoggedIn")
const urlImgValidator = require("../middleware/urlImgValidator")
const isLifeHackAuthoredByUser = require("../middleware/isLifehackAuthoredByUser")
const getDefaultImg =require("../middleware/getDefaultImg")
const fileUploadedValidator = require("../middleware/fileUploadedValidator");

//require Utils
const compareIds=require("../utils/compareIds")
const getCloudinaryIDfromUrl=require("../utils/getCloudinaryIDfromUrl");
const deleteFileFromCloudinary = require("../utils/deleteFileFromCloudinary");
const isDefaultImage=require("../utils/isDefaultImage");
const removeImageUnlessTagDefault = require("../utils/removeImageUnlessTagDefault");

// read: Display all LH
router.get("/lifehacks",(req,res,next)=>{
   
    Lifehack.find().populate("tags")
        .then((allLH)=>{
                      
            res.render("lifehacks/lifehacks-list",{
                allLH,
                fromAllList:true
            })
        })
        .catch(error=>console.log(`there was an error getting all the LF...`,error))
})

//read: create new lH form
router.get("/lifehacks/create",isLoggedIn,(req,res,next)=>{

    Tag.find()
        .then(tagsArray=>{
            
            res.render("lifehacks/lifehack-create",{tagsArray})
        })
        .catch(error=>{
            console.log("there has been an error getting the tags===>",error)
        })
})
// post: create new lH in DB

 router.post("/lifehacks/create",
   isLoggedIn,
   fileUploader.fields([
     { name: "image01", maxCount: 1 },
     { name: "video01", maxCount: 1 },
   ]),
   fileUploadedValidator,
   urlImgValidator,
   getDefaultImg,
   (req, res, next) => {
     const userInSession = req.session.currentUser;
     const totalTagsArray= res.locals.tagsArray
     //store img link of cloudinary
     let imageUploadUrl = req.files.image01 ? req.files.image01[0].path : null;

     let videoUploadUrl = req.files.video01 ? req.files.video01[0].path : null;
    if(!req.body.tags){
      req.body.tags=totalTagsArray[totalTagsArray.length-1]._id.toString()
      
    }
    
         const newLifehackData = {
           title: req.body.title,
           description: req.body.description,
           embedMultimedia:
             imageUploadUrl || req.body.embedMultimedia || res.locals.defaultImgUrl,
           tags: req.body.tags,
           videoUrl: videoUploadUrl,
           author: userInSession._id,
         };

     Lifehack.create(newLifehackData)
       .then((newLifehack) => {
         res.redirect(`/lifehacks/${newLifehack._id}`);
        
       })
       .catch((error) => {
         console.log(
           "there has been an error creating the lifehack===>",
           error
         );
       });
   }
 );


router.get("/lifehacks/random-lifehack",(req,res,next)=>{

    Lifehack.countDocuments()
        .then(numberOfLifehacks=>{
            const randomNum =Math.floor(Math.random()*numberOfLifehacks)

            return Lifehack.find().skip(randomNum).limit(1).populate(["tags","author"])
        })
        .then((randomLifehack)=>{

            res.render("lifehacks/lifehack-details",randomLifehack[0])

        })
        .catch(error=>{
            console.log(`there was an error getting a Random Lifehack`,error)
            next(error)
        })
})
//read: display details of a LH
router.get("/lifehacks/:lifehackId",(req,res,next)=>{
    const lifehackId = req.params.lifehackId
    Lifehack.findById(lifehackId).populate(["tags","author"])
        .then(lifehack=>{
            
            res.render("lifehacks/lifehack-details",lifehack)
        })
        .catch(error=>{
            console.log("there has been an error getting the details of the LH==>",error)
        })

})
//read: display edit form
router.get("/lifehacks/:lifehackId/edit",isLoggedIn,isLifeHackAuthoredByUser,(req,res,next)=>{
    const lifehackId = req.params.lifehackId
    const userDetails = req.session.currentUser


    const data = {}
    Lifehack.findById(lifehackId).populate("tags")
    .then(lifehack=>{
        data.lifehack=lifehack   

        //we storage this here to compare in the post request
        req.session.urlImgCloudinary = data.lifehack.embedMultimedia[0]
        req.session.urlVideoCloudinary =data.lifehack.videoUrl
        

          return Tag.find() 
        })
        .then(tagsArray=>{
            data.tagsArray=tagsArray

            const tagsNotSelected = tagsArray.filter((tag) => {
                let counter = 0;
                data.lifehack.tags.forEach((tagSelected) => {
                  if (tag._id.toString() ===  tagSelected._id.toString()) {
                    counter++;
                  }
                });
                if (counter >= 1) {
                  return false;
                } else {
                  return true;
                }
              });
              
            data.tagsNotSelected= tagsNotSelected
            
            res.render("lifehacks/lifehack-edit",data)
        })
        .catch(error=>{
            console.log("there has been an error in the get request to edit the LH==>",error)
            
            next(error)
        })

})

//post: update LH in DB
router.post("/lifehacks/:lifehackId/edit",
  isLoggedIn,
  isLifeHackAuthoredByUser,
  fileUploader.fields([
    { name: "image01", maxCount: 1 },
    { name: "video01", maxCount: 1 },
  ]),
  fileUploadedValidator,
  urlImgValidator,
  getDefaultImg,
  (req, res, next) => {
    const lifeHackId = req.params.lifehackId;
    const userInSession = req.session.currentUser;

    const lastImageUrl = req.session.urlImgCloudinary;
    const lastVideoUrl = req.session.urlVideoCloudinary;
    const tagsObjArray = res.locals.tagsArray;

    let imageUploadUrl = req.files.image01 ? req.files.image01[0].path : null;

    let videoUploadUrl = req.files.video01 ? req.files.video01[0].path : null;

    //checks if we are  uploading a new image
    if (req.files.image01 || req.body.embedMultimedia !== lastImageUrl) {

      
      //we are uploading a new image

      removeImageUnlessTagDefault(lastImageUrl, tagsObjArray);
    }
    //checks if we are uploading a new video
    
    if (req.files.video01) {
      //we are uploading a new video

      let cloudinaryVideoID = getCloudinaryIDfromUrl(lastVideoUrl);
      deleteFileFromCloudinary(cloudinaryVideoID);
    }

    const newLifehackData = {
      title: req.body.title,
      description: req.body.description,
      embedMultimedia:
        imageUploadUrl || req.body.embedMultimedia || res.locals.defaultImgUrl,
      videoUrl: videoUploadUrl || req.body.videoUrl,
      tags: req.body.tags,
    };

    Lifehack.findByIdAndUpdate(lifeHackId, newLifehackData)
      .then((LifehackUpdated) => {
        res.redirect(`/lifehacks/${LifehackUpdated._id}`);
      })
      .catch((error) => {
        console.log("there has been an error editing the LH===>", error);
      });
  }
);
router.post(`/lifehacks/:lifehackId/delete`,isLoggedIn,isLifeHackAuthoredByUser,(req,res,next)=>{
    const lastUrl= req.headers.referer
    const lifehackId=req.params.lifehackId
    const tagsObjArray=res.locals.tagsArray
    let lastImageUrl=''
    let lastVideoUrl=''
    
               
        Lifehack.findByIdAndDelete(lifehackId)
        .then((response)=>{
            lastImageUrl=response.embedMultimedia[0]
            lastVideoUrl=response.videoUrl
            
            
            removeImageUnlessTagDefault(lastImageUrl,tagsObjArray)

            let cloudinaryVideoID = getCloudinaryIDfromUrl(lastVideoUrl)
            
            if(lastVideoUrl){deleteFileFromCloudinary(cloudinaryVideoID,`video`)}
            

            
           
            
            if(lastUrl.endsWith(`profile`)){
                res.redirect(lastUrl)
                
            }else{
                res.redirect("/lifehacks")
            }

        })
        .catch(error=>{
            console.log(`there has been an error deleting the LH==>`,error)
        })
})


router.post(`/lifehacks/:lifehackId`, (req, res, next) => {
    const lifehackId = req.params.lifehackId;

    if (!req.session.currentUser) {
        res.redirect(`/login`);
    } else {
        const userId =  req.session.currentUser._id;
        // Check if this user has liked this LH
        User.findById(userId)
            .then((result) => {
                const postsLikedArray = result.postsLiked;
                const isLikedByUser = postsLikedArray.some(lhId => {
                    if (lhId.toString() === lifehackId.toString()) {
                        return true;
                    }
                })
                // User has liked the post, remove from postsLiked array and remove 1 like
                if (isLikedByUser === true) {
                    const removeLhFromUser = User.findByIdAndUpdate({_id: userId}, {$pull: {postsLiked: lifehackId}});
                    const removeLike = Lifehack.findByIdAndUpdate({_id: lifehackId}, {$inc: {likes: -1}});
                    res.locals.warning = "You have already liked this post"; // not working now??
                    Promise.all([removeLhFromUser, removeLike])
                        .then((result) => {
                            res.redirect(`/lifehacks/${lifehackId}`)
                        })
                } 
                // User has NOT liked the post, add to DB AND increment
                else {
                    const addLhToUser = User.findByIdAndUpdate({_id: userId}, {$push: {postsLiked: lifehackId}});
                    const addLike = Lifehack.findByIdAndUpdate({_id: lifehackId}, {$inc: {likes: 1}});
                    Promise.all([addLhToUser, addLike])
                        .then((result) => {
                            res.redirect(`/lifehacks/${lifehackId}`)
                        })
                }
            })
            .catch(error => {
                console.log(`There has been an error updating the likes in the DB`, error);
            })
    }
});

module.exports = router;