var randomNumber1 = Math.floor(Math.random() * 6)+1;
var randomNumber2 = Math.floor(Math.random() * 6)+1;

var pathImg1 = "assets/images/dice"+randomNumber1+".png";
var pathImg2 = "assets/images/dice"+randomNumber2+".png";

var diceImg1 = document.querySelector(".img1").setAttribute("src", pathImg1);
var diceImg2 = document.querySelector(".img2").setAttribute("src", pathImg2);

var titleTxt = document.querySelector("h1");

if(randomNumber1 === randomNumber2){
  titleTxt.textContent = "Draw!";
}else if(randomNumber1 > randomNumber2){
  titleTxt.textContent = "🚩 Player 1 Wins!";
}else{
  titleTxt.textContent = "Player 2 Wins! 🚩";
}