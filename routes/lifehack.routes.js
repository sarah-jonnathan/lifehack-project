const router = require("express").Router();
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model")
const Tag = require("../models/Tag.model")

// read: Display all LH
router.get("/lifehacks",(req,res,next)=>{
    Lifehack.find().populate("tags")
        .then((allLH)=>{
                      
            res.render("lifehacks/lifehacks-list",{allLH})
        })
        .catch(err=>console.log(`we have an error...`,err))
})

//read: create form
router.get("/lifehacks/create",(req,res,next)=>{
    Tag.find()
        .then(tagsArray=>{
            res.render("lifehacks/lifehack-create",{tagsArray})
        })
        .catch(err=>{
            console.log("there has been an error===>",err)
        })
})
//post: create form
router.post("/lifehacks/create",(req,res,next)=>{

    
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
        .catch(err=>{
            console.log("there has been an error===>",err)
        })
    
    
})
//read: display details of a LH
router.get("/lifehacks/:lifehackId",(req,res,next)=>{
    const lifehackId = req.params.lifehackId
    Lifehack.findById(lifehackId).populate("tags")
        .then(lifehack=>{
            
            res.render("lifehacks/lifehack-details",lifehack)
        })
        .catch(err=>{
            console.log("there has been an error==>",err)
        })

})

module.exports =router