const deleteFileFromCloudinary = require("./deleteFileFromCloudinary");
const getCloudinaryIDfromUrl = require("./getCloudinaryIDfromUrl");
const isDefaultImage= require("./isDefaultImage")

const removeImageUnlessTagDefault = function (url, tagsObjArray) {


  if (url.startsWith("https://res.cloudinary")) {
    //check if the image is from a Tag, if it is we dont erase it
    const isTagImage = isDefaultImage(url, tagsObjArray);

    if (isTagImage) {
      console.log(`we can not erase a default image`);
    } else {
      
      const fileNameId = getCloudinaryIDfromUrl(url);
      console.log(`image id `, fileNameId)
      deleteFileFromCloudinary(fileNameId,`image`);
      
    }
  }
};
module.exports=removeImageUnlessTagDefault
