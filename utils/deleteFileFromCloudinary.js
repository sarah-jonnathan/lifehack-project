const cloudinary = require('cloudinary').v2;

const deleteFileFromCloudinary = async function(fileNameId, fileType){
    try{
      if(fileType === 'image'){
        await cloudinary.uploader.destroy(fileNameId, { resource_type: 'image' });
      }
      else if (fileType === 'video') {
        await cloudinary.uploader.destroy(fileNameId, { resource_type: 'video' });
      }
      console.log(`Old cloudinary ${fileType} deleted`)
    }catch(error){
      console.log(`the has been an error deleting the ${fileType} for the DB`,error)
    }
  }

module.exports = deleteFileFromCloudinary