
const compareIds= require("../utils/compareIds")
const axios =require('axios')
const Comment = require("../models/Comment.model")



const isCommentAuthoredByUser= async function(req,res,next){
   
    const userDetails = req.session.currentUser
    const commentId = req.params.commentId

    
    if(req.session.currentUser.isAdmin){
        next()
    }else{

        try{
            const comment = await Comment.findById(commentId)
    
            const userIsAuthor = compareIds(comment.commentAuthor,userDetails._id)
            if(!userIsAuthor){
                throw new Error (`sorry ${userDetails.username}, only authors can edit or delete their comments`)
            }else{
                next()
            }
    
    
        }catch(error){
            next(error)
    
        }
    }
}
module.exports=isCommentAuthoredByUser