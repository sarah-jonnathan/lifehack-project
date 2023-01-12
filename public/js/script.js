// // https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("lifehack-project JS imported successfully!");
// });

const createBtnDomElem = document.getElementById("create")

const form = document.getElementById("form-lh")



//event listeners 
if(createBtnDomElem){
  
  createBtnDomElem.addEventListener(`click`,(e)=>{

    if(form.checkValidity()) {
      
      //step1 create the element
      const loadingSignalDomElem = document.createElement("div")
      //step2 add properties
        
      loadingSignalDomElem.id ="loading"
      
      //step3
      document.body.appendChild(loadingSignalDomElem)


    }
    
   
  })

}

