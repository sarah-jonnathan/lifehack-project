const axios=require('axios')
const { builtinModules } = require('module')


const urlImgValidator = async function(req,res,next){
    const url=req.body.embedMultimedia
    
    try{
        const response = await axios.head(url)

        console.log(`a ver que nos mandan======>`,response.headers[`content-type`])
        if(response.headers['content-type'].startsWith("image")){
             console.log(`the url is valid for an img`)
             next()
        }else{
            console.log(`the url is not an img`)
            

            
        }
    }catch(error){
        console.log(`there has been an error=====>${error}`)
        next(error)
    }

    


}
const mwFunctions={
    urlImgValidator
}

module.exports = mwFunctions