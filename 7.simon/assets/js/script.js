var buttonColors = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
var gamePattern = [];
var level = 0;

var started = false;

$(".btn").click(function(){
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);
  
  checkAnswer(userClickedPattern.length-1);
});

$(document).keypress(function(){
  if(!started){
    nextSequence();
    $("#level-title").text("Level "+level);
    started = true;
  }
  
});

$(".btn-start").click(function(){
  if(!started){
    $(".btn-start").addClass("hidden-text");
    nextSequence();
    $("#level-title").text("Level "+level);
    started = true;
  }
  
});


function nextSequence(){
  userClickedPattern = [];

  level++;
  $("#level-title").text("Level "+level);

  var randomNumber = Math.floor(Math.random()*4);
  var randomChosenColour = buttonColors[randomNumber];

  playSound(randomChosenColour);

  $("#"+randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

  gamePattern.push(randomChosenColour);
}

function playSound(color){
  var audioPath = "assets/sounds/"+color+".mp3";
  var audio = new Audio(audioPath);
  audio.play();
}

function animatePress(currentColor){
  var colorId = "#"+currentColor;
  $(colorId).addClass("pressed");

  setTimeout(function(){
    $(colorId).removeClass("pressed");
  },100);
}

function checkAnswer(currentLevel){
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
    console.log("sucess");
    if(userClickedPattern.length === gamePattern.length){
      setTimeout(function(){
        nextSequence();
      }, 1000);
      userClickedPattern = [];
    }
  }else{
    console.log("wrong");
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function (){
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    $(".btn-start").text("RESTART");
    $(".btn-start").removeClass("hidden-text");
    starterOver();
  }
}

function starterOver(){
  level = 0;
  gamePattern = [];
  started = false;
}