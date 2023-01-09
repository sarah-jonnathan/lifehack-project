 //checks if the url given is one of our tags images
const isDefaultImage= function(imageUrl,tagsArray){
    return tagsArray.some(tagObject=>{
        if(tagObject.img===imageUrl){
            return true
        }
    })
}

module.exports = isDefaultImage