require("dotenv").config();
const getCloudinaryIDfromUrl = (url)=>{
const folderName = process.env.CLOUDINARY_CONTAINING_FOLDER || "lifehack"
console.log(folderName)
  if(!url){
    return null
  }else{

    const start = url.indexOf(folderName)
    const finish = url.lastIndexOf(".")

    const cloudinaryId = url.substring(start,finish)

    return cloudinaryId;
  }
}

module.exports = getCloudinaryIDfromUrl
