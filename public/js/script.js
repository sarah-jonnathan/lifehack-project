// // https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("lifehack-project JS imported successfully!");
// });

const createBtnDomElem = document.getElementById("create")
const loadingSignalDomElem = document.getElementById("loading")

console.log


//event listeners
createBtnDomElem.addEventListener(`click`,()=>{
  
  loadingSignalDomElem.removeAttribute("hidden")
  
})

// const selectElem = document.querySelector("select[name='tags']");
// selectElem.addEventListener("change", function() {
//   const selectedOptions = [...this.options].filter(option => option.selected);
//   if (selectedOptions.length === 0) {
//     this.options[0].selected = true;
//   }
// });