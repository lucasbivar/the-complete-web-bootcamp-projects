
function playSound(key){
  switch (key) {
    case "w":
        var crash = new Audio("assets/sounds/crash.mp3");
        crash.play();
      break;
    case "a":
        var snare = new Audio("assets/sounds/snare.mp3");
        snare.play();
      break;
    case "s":
        var kick = new Audio("assets/sounds/kick-bass.mp3");
        kick.play();
      break;
    case "d":
        var tom1 = new Audio("assets/sounds/tom-1.mp3");
        tom1.play();
      break;
    case "f":
        var tom2 = new Audio("assets/sounds/tom-2.mp3");
        tom2.play();
      break;
    case "g":
        var tom3 = new Audio("assets/sounds/tom-3.mp3");
        tom3.play();
      break;
    case "h":
        var tom4 = new Audio("assets/sounds/tom-4.mp3");
        tom4.play();
      break;
    default:
        console.log(key);
      break;
  }
}

function buttonAnimation(currentKey){

  var activeButton = document.querySelector("." + currentKey);

  activeButton.classList.add("pressed");
  setTimeout(function(){
    activeButton.classList.remove("pressed");
  }, 100);

}
var numberOfDrumButtons = document.querySelectorAll(".drum");
for(var i = 0; i < numberOfDrumButtons.length; i++){
  numberOfDrumButtons[i].addEventListener("click", function (){
    var buttonInnerHTML = this.innerHTML;
    playSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
  });
}


document.addEventListener("keydown", function (event){
  playSound(event.key);
  buttonAnimation(event.key);
})