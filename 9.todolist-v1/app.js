const express = require('express');
const bodyParser = require('body-parser');
const { inflateSync } = require('zlib');

const app = express();

var items = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day = today.toLocaleDateString("en-US", options);
  res.render("list", {kindOfDay: day, newListItem: items});
});

app.post('/', function(req, res){
  items.push(req.body.newItem);
  res.redirect("/");
});


app.listen(3000, function(){
  console.log("Server is running on PORT 3000");
})