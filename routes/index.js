var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req,res){
   res.render("landing"); 
});
//Auth routes
//=============
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res){

    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcome to Yelpcamp "+user.username);
            res.redirect("/camp");
        }); 
    });
});
// login routes 
router.get("/login", function(req, res) {
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/camp",
        failureRedirect:"/login"
    }),
function(req, res){
});
//logout
router.get("/logout", function(req, res) {
   req.logout(); 
   req.flash("success", "You have been logged out");
   res.redirect("/camp");
});


module.exports = router;