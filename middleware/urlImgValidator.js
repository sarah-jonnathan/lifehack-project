const axios=require('axios')
const { builtinModules } = require('module')


const urlImgValidator = async function(req,res,next){

    if(!req.body.embedMultimedia){
        console.log(`there is no url`)
        next()
    }else{
        const url=req.body.embedMultimedia
                
        try{
            const response = await axios.head(url)
    
            
            if(response.headers['content-type'].startsWith("image")){
                 console.log(`the url is valid for image`)
                 next()
            }else{
                console.log(`the url is not an image`)
                
                
    
                
            }
        }catch(error){
            console.log(`there has been an error in urlImgValidator=====>${error}`)
            next(error)
        }
        
    }

    


}


module.exports = urlImgValidator