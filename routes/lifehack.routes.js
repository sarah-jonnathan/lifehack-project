const router = require("express").Router();
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model")
const Tag = require("../models/Tag.model")

// Display all LH
router.get("/lifehacks",(req,res,next)=>{
    Lifehack.find().populate("tags")
        .then((lifehacksArray)=>{
            console.log(lifehacksArray[0].tags[0])
            
            res.render("lifehacks/lifehacks-list",{lifehacksArray})
        })
        .catch(err=>console.log(`we have an error...`,err))
})
//diplay create form

router.get("/lifehacks/create",(req,res,next)=>{
    Tag.find()
        .then(tagsArray=>{
            res.render("lifehacks/lifehack-create",{tagsArray})
        })
        .catch(err=>{
            console.log("there has been an error===>",err)
        })
    
    
})
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

module.exports =router