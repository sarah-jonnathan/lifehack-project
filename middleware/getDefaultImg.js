


const getDefaultImg= function(req,res,next){

    //only passes a image if the user does not provide an image for the lH
    if(!req.body.embedMultimedia || !req.files.image ){
        
        
        
        //evaluate if one or more tags were selected (we get only the Ids)
        const myIdTags= req.body.tags
        let myIdTagsArray=[]
        if(Array.isArray(myIdTags)){
            myIdTagsArray=myIdTags
        }else if( typeof myIdTags==="string"){
            myIdTagsArray.push(myIdTags)
        }else{
            console.log(`0 tags selected`)
           next() 
        }
        
        //compare the ids of the tags selected with all the tags in the DB
        //and create a new array tagsSelected with all the information about the tags selected

        const totalTagsArray= res.locals.tagsArray
        let tagsSelected= []
        myIdTagsArray.forEach(myId=>{
            let oneTag= totalTagsArray.filter(tagObject=>{
                if(tagObject._id.toString()===myId){

                    return {name:tagObject.name,url:tagObject.img}
                }
            })
            tagsSelected.push(...oneTag)
        })
        
        const randomIndex = Math.floor(Math.random()*tagsSelected.length)
        
        //save in locals the URl to use it when we create the new lifehack in the next middleware function
        res.locals.defaultImgUrl= tagsSelected[randomIndex].img

        next()
        
        
        


    }else{
        next()
    }
    
}


module.exports = getDefaultImg