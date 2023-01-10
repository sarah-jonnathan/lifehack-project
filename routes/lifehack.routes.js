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

//require Utils
const compareIds=require("../utils/compareIds")
const getCloudinaryIDfromUrl=require("../utils/getCloudinaryIDfromUrl");
const deleteOldImg = require("../utils/deleteOldImg");
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
//post: create new lH in DB
router.post("/lifehacks/create",isLoggedIn,urlImgValidator,fileUploader.single('image01'),getDefaultImg,(req,res,next)=>{

    
    const userInSession =  req.session.currentUser

   //store img link of cloudinary 
    let imageUploadUrl = req.file ? req.file.path : null;


    const newLifehackData = {
        title: req.body.title,
        description:req.body.description,
        embedMultimedia: imageUploadUrl || req.body.embedMultimedia || res.locals.defaultImgUrl,
        tags:req.body.tags,
        author:  userInSession._id      
    }

    Lifehack.create(newLifehackData)
        .then((newLifehack)=>{
            res.redirect("/lifehacks")
            
        })
        .catch(error=>{
            console.log("there has been an error creating the lifehack===>",error)
        })
    
    
})
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
        req.session.urlCloudinary = data.lifehack.embedMultimedia

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
router.post("/lifehacks/:lifehackId/edit",isLoggedIn,isLifeHackAuthoredByUser,urlImgValidator,fileUploader.single('image01'),getDefaultImg,(req,res,next)=>{

    const lifeHackId =req.params.lifehackId
    const userInSession =  req.session.currentUser
    let imageUploadUrl=null
    const lastImageUrl=req.session.urlCloudinary[0]
    const tagsObjArray=res.locals.tagsArray
    

    //checks if we are  uploading a new image
    if(req.file||req.body.embedMultimedia!==lastImageUrl){//we are uploading a new image
        if(req.file){

            imageUploadUrl= req.file.path
        }
        
        removeImageUnlessTagDefault(lastImageUrl,tagsObjArray)
           

    }


    
    const newLifehackData = {
        title: req.body.title,
        description:req.body.description,
        embedMultimedia:imageUploadUrl||req.body.embedMultimedia||res.locals.defaultImgUrl,
        tags:req.body.tags,
          
    }

    Lifehack.findByIdAndUpdate(lifeHackId,newLifehackData)
        .then((LifehackUpdated)=>{
            res.redirect(`/lifehacks/${LifehackUpdated._id}`)
            
        })
        .catch(error=>{
            console.log("there has been an error editing the LH===>",error)
        })
    
    
})
router.post(`/lifehacks/:lifehackId/delete`,isLoggedIn,isLifeHackAuthoredByUser,(req,res,next)=>{
    const lastUrl= req.headers.referer
    const lifehackId=req.params.lifehackId
    const tagsObjArray=res.locals.tagsArray
    let lastImageUrl=''
    
               
        Lifehack.findByIdAndDelete(lifehackId)
        .then((response)=>{
            lastImageUrl=response.embedMultimedia[0]
            
            
            removeImageUnlessTagDefault(lastImageUrl,tagsObjArray)
            
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
    Lifehack.findOneAndUpdate({_id: lifehackId}, {$inc: {likes: 1}})
    .then(() => {
        res.redirect(`/lifehacks/${lifehackId}`);
    })
    .catch(error => {
        console.log(`There has been an error updating the likes in the DB`,error)
    })
})

module.exports = router;