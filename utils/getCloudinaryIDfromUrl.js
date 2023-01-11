const getCloudinaryIDfromUrl = (url)=>{

  if(!url){
    return null
  }else{

    const start = url.indexOf("lifehack")
    const finish = url.lastIndexOf(".")

    const cloudinaryId = url.substring(start,finish)

    return cloudinaryId;
  }
}

module.exports = getCloudinaryIDfromUrl
