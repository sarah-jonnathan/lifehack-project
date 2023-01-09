const cloudinary = require('cloudinary').v2;

const deleteOldImg = async function(fileNameId){
    try{
        await cloudinary.uploader.destroy(fileNameId)
        console.log(`Old cloudinary img delete`)
       

    }catch(error){
        console.log(`the has beeen an error deleting the img for the DB`,error)
    }


}

module.exports = deleteOldImg