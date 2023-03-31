
const Tag = require("../models/Tag.model")

const getTags = async function(req,res,next){
    
    try{
        const tagsArray = await Tag.find() 
        res.locals.tagsArray =tagsArray
        
        next()
    }catch(error){
        console.log(`there was an error getting the tags from the DB====>${error}`)
        next(error)
    }
}

module.exports = getTags;