//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true})); 
app.use(session({
  secret: 'Our little secret.',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,  useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: [type=String]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
)); 

passport.use(new FacebookStrategy({
  clientID: process.env.CLIENT_FACEBOOK_ID,
  clientSecret: process.env.CLIENT_FACEBOOK_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/secrets"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/auth/google", 
  passport.authenticate('google', { scope: ["profile"]}));

app.get("/auth/google/secrets", function(req, res){
  passport.authenticate('google', { failureRedirect: "/login" })(req, res, function() {
    res.redirect("/secrets");
  });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
  });


app.get("/login", function(req, res) {
  res.render("login", {invalidLogin: false});
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.get("/secrets", function(req, res){
    User.find({"secret": {$ne: null}}, function(err, foundUsers) {
      if(err){
        console.log(err);
      }else{
        if(foundUsers){
          res.render("secrets", {usersWithSecrets: foundUsers});
        }
      }
    });
});

app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("submit"); 
  }else{
    res.redirect("/");
  }
});

app.post("/submit", function (req, res) {
  const submittedSecret = req.body.secret;
  User.findById(req.user.id, function (err, foundUser) {
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        foundUser.secret.push(submittedSecret);
        foundUser.save(function() {
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.post("/register", function(req, res) {
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate('local')(req, res, function () {
        res.redirect('/secrets');
      });
    }
  });
});

app.post("/login", function(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate('local', function(err, user) {
        if (err) { return next(err); }
        if (!user) { return res.render('login', {invalidLogin: true}); }else{
          return res.redirect('/secrets');
        }
        
      })(req, res, function () {
      });
    }
  });

});

app.listen(3000, function() {
  console.log("Server is running on PORT 3000");
})