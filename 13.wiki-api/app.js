const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { static } = require("express");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

/////////////////////////All Articles///////////////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req, res){
  
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.")
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany( function(err){
    if(!err){
      res.send("Successfully deleted all articles.");
    }else{
       res.send(err);
    }
  });
});

/////////////////////////Individual Articles///////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
  const articleTitle = req.params.articleTitle;
  Article.find({title: articleTitle}, function(err, articleFound) {
    if(articleFound){
      const jsonArticle = JSON.stringify(articleFound);
      res.send(jsonArticle);
    }else{  
      res.send("No article with that title found.");
    }
  });
})

//PUT - OVERWRITE THE DOCUMENT
//PATCH - UPDATE THE FIELDS

.put(function(req, res) {
  const articleTitle = req.params.articleTitle;

  Article.findOneAndUpdate(
    {title: articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})

.patch(function(req, res) {
  const articleTitle = req.params.articleTitle;

  Article.updateOne(
    {title: articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})

.delete(function(req, res) {
  const articleTitle = req.params.articleTitle;

  Article.deleteOne({title: articleTitle}, function(err) {
    if (!err){
      res.send("Successfully deleted the content of the selected article.");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});