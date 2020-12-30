const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.get('/', function(req, res){
  res.send("Ola mundo");
});

app.listen(3000, function(){
  console.log("Server is running on PORT 3000");
})