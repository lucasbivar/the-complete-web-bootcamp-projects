const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.get('/', function(req, res){
  
  var today = new Date();
  var currentDay = today.getDay();

  if(currentDay === 6 || currentDay === 0){
    res.send("Yay it's the weekend");
  }else{
    res.send("Boo! I have to work");
  }
});

app.listen(3000, function(){
  console.log("Server is running on PORT 3000");
})