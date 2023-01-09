const getCloudinaryIDfromUrl = (url)=>{

    const start = url.indexOf(`lifehack`);
    let finish;
    if (url.indexOf(`.jpg`) !== -1) {
      finish = url.indexOf(`.jpg`);
    } else if (url.indexOf(`.png`) !== -1) {
      finish = url.indexOf(`.png`);
    } else {
      console.log(`that is not an image`);
    }
    let cloudinaryId = '';
    for (let i = start; i < finish; i++) {
      cloudinaryId += url[i];
    }
    return cloudinaryId;
  }

module.exports = getCloudinaryIDfromUrl