//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/todolistDB',  { useUnifiedTopology: true, useNewUrlParser: true });

const itemScheme = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item",itemScheme);

const item1 = new Item({name: "Welcome to your todolist!"});
const item2 = new Item({name: "Hit the + button to add a new item."});
const item3 = new Item({name: "<-- Hit this to delete an item."});

const defautItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemScheme]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  const day = date.getDate();

  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defautItems, function(error){
        if(error){
          console.log(error);
        }else{
          console.log("Succesfully saved default items to DB.");
        }
      });
      res.redirect('/');
    }else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }

  });

});

app.post("/", function(req, res){

  const item = new Item({name: req.body.newItem});
  item.save();
  res.redirect("/");
 
});

app.post('/delete', function(req, res){
  const checkedItemId = req.body.checkboxId;
  Item.deleteOne({_id: checkedItemId}, function(err){
    if(!err){ 
      console.log("Succesfully deleted.");
      res.redirect('/');
    }
  });
});

app.get('/:customListName', function(req, res){

  const customListName = req.params.customListName;
  
  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({name: customListName, items: defautItems});
        list.save();
        res.redirect('/'+customListName);
      }else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
