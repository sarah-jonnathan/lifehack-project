const axios = require("axios")
//this middleware function is not used at the momment
const urlVideoValidator = async function(req,res,next){
    
    if(!req.body.videoUrl){
        console.log(`that url dont point to a video`)
        next()
    }else if(req.body.videoUrl){
        const url=req.body.videoUrl

        try{
            const response = await axios.head(url)
            if(response.headers['content-type'].startsWith("video")){
                console.log(`the url is valid for a video`)
                next()
           }else{
               console.log(`the url is not a video`)            
                 
           }



        }catch(error){
            console.log(`there has been an error in urlVideoValidator`)
        }
    }
}