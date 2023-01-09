
const compareIds= require("../utils/compareIds")
const axios =require('axios')
const Lifehack = require("../models/Lifehack.model")



const isLifeHackAuthoredByUser= async function(req,res,next){
   
    const userDetails = req.session.currentUser
    const lifehackId = req.params.lifehackId

    
    if(req.session.currentUser.isAdmin){
        next()
    }else{

        try{
            const lifehack = await Lifehack.findById(lifehackId)
    
            const userIsAuthor = compareIds(lifehack.author,userDetails._id)
            if(!userIsAuthor){
                throw new Error (`sorry ${userDetails.username}, only authors can edit or delete their lifehacks`)
            }else{
                next()
            }
    
    
        }catch(error){
            next(error)
    
        }
    }
}
module.exports=isLifeHackAuthoredByUser

