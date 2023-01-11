// // https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("lifehack-project JS imported successfully!");
// });

const createBtnDomElem = document.getElementById("create")
const loadingSignalDomElem = document.getElementById("loading")
const form = document.getElementById("form-lh")



//event listeners lifehack-create/lifehack-view
if(createBtnDomElem){
  
  createBtnDomElem.addEventListener(`click`,(e)=>{
    
    if(form.checkValidity()) {
      loadingSignalDomElem.removeAttribute("hidden")
    }
      
  })

}

