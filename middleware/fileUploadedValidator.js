const deleteFileFromCloudinary = require("../utils/deleteFileFromCloudinary");

const fileUploadedValidator = function(req,res,next){
    const imgFile= req.files.image01 ? req.files.image01[0] : null;
    const videoFile= req.files.video01 ? req.files.video01[0] : null;

    //checks if the video was uploaded in the video form
    if(!videoFile){
        console.log(`no video was uploaded`);

    }else if(videoFile.mimetype.startsWith(`image`)){
        
        console.log(`the user is updating an img as a video`)
        
        deleteFileFromCloudinary(req.files.video01[0].filename,`image`)
        req.files.video01=null
        console.log(`img uploaded deleted from cloudinary`)

    }else if(videoFile.mimetype.startsWith(`video`)){
        console.log("the video file was uploaded correctly")
    }
    //checks if the img was uploaded in the img form 
    if(!imgFile){
        console.log(`no img was uploaded`);

    }else if(imgFile.mimetype.startsWith(`video`)){
        
        console.log(`the user is updating a video  as an img`)
        deleteFileFromCloudinary(req.files.image01[0].filename,`video`)
        req.files.image01=null
        console.log(`video uploaded deleted from cloudinary`)


    }else if(imgFile.mimetype.startsWith(`image`)){
        console.log("the image file was uploaded correctly")
    }
    
    next()
    

}

module.exports=fileUploadedValidator