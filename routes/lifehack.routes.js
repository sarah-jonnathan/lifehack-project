const router = require("express").Router();
const Lifehack = require("../models/Lifehack.model")
const User = require("../models/User.model")
const Tag = require("../models/Tag.model")
const isLoggedIn = require("../middleware/isLoggedIn")
// read: Display all LH
router.get("/lifehacks",(req,res,next)=>{
    Lifehack.find().populate("tags")
        .then((allLH)=>{
                      
            res.render("lifehacks/lifehacks-list",{allLH,fromAllList:true})
        })
        .catch(err=>console.log(`we have an error...`,err))
})

//read: create new lH form
router.get("/lifehacks/create",isLoggedIn,(req,res,next)=>{
    Tag.find()
        .then(tagsArray=>{
            res.render("lifehacks/lifehack-create",{tagsArray})
        })
        .catch(err=>{
            console.log("there has been an error===>",err)
        })
})
//post: create new lH in DB
router.post("/lifehacks/create",isLoggedIn,(req,res,next)=>{

    
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
//read: display edit form
router.get("/lifehacks/:lifehackId/edit",isLoggedIn,(req,res,next)=>{
    const lifehackId = req.params.lifehackId
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
        .catch(err=>{
            console.log("there has been an error==>",err)
        })

})

//post: update LH in DB
router.post("/lifehacks/:lifehackId/edit",isLoggedIn,(req,res,next)=>{

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
        .catch(err=>{
            console.log("there has been an error===>",err)
        })
    
    
})
router.post(`/lifehacks/:lifehackId/delete`,isLoggedIn,(req,res,next)=>{
    const lifehackId=req.params.lifehackId
    console.log(lifehackId)
    Lifehack.findByIdAndDelete(lifehackId)
        .then(()=>{
            
            res.redirect("/lifehacks")

        })
        .catch(err=>{
            console.log(`there has been an error==>`,err)
        })
})

module.exports =router