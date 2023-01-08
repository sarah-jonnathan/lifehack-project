const router = require("express").Router();
const app =require("../app")
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model")
const Tag = require("../models/Tag.model")

//require middleware functions
const isLoggedIn = require("../middleware/isLoggedIn")
const urlImgValidator = require("../middleware/urlImgValidator")
const isLifeHackAuthoredByUser = require("../middleware/isLifehackAuthoredByUser")

//require Utils
const compareIds=require("../utils/compareIds")

// read: Display all LH
router.get("/lifehacks",(req,res,next)=>{
   
    Lifehack.find().populate("tags")
        .then((allLH)=>{
                      
            res.render("lifehacks/lifehacks-list",{allLH,fromAllList:true})
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
router.post("/lifehacks/create",isLoggedIn,urlImgValidator,(req,res,next)=>{

    
    const userInSession =  req.session.currentUser
   

    const newLifehackData = {
        title: req.body.title,
        description:req.body.description,
        embedMultimedia:req.body.embedMultimedia,
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
router.post("/lifehacks/:lifehackId/edit",isLoggedIn,isLifeHackAuthoredByUser,urlImgValidator,(req,res,next)=>{

    const lifeHackId =req.params.lifehackId
    const userInSession =  req.session.currentUser
    
    

    const newLifehackData = {
        title: req.body.title,
        description:req.body.description,
        embedMultimedia:req.body.embedMultimedia,
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
               
        Lifehack.findByIdAndDelete(lifehackId)
        .then(()=>{
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



module.exports =router