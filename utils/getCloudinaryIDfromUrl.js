const getCloudinaryIDfromUrl = (url)=>{

  if(!url){
    return null
  }else{
    
    const start = url.indexOf(`lifehack`);
    let finish;
    if (url.indexOf(`.jpg`) !== -1) {
      finish = url.indexOf(`.jpg`);
    } else if (url.indexOf(`.png`) !== -1) {
      finish = url.indexOf(`.png`);
      console.log(`its an image`)
    }else if(url.indexOf(`.mp4`) !== -1){  
      finish = url.indexOf(`.mp4`)
      console.log(`its a video`)
    }else if(url.indexOf(`.webm`) !== -1){  
      finish = url.indexOf(`.webm`)
    } else {
      console.log(`that is not an image/video`);
    }
    let cloudinaryId = "";
    for (let i = start; i < finish; i++) {
      cloudinaryId += url[i];
    }
    return cloudinaryId;
  }
}

module.exports = getCloudinaryIDfromUrl
