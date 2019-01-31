var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
      if (req.isAuthenticated()){
      // find campground with id
          Campground.findById(req.params.id, function(err, foundCamp){
        if (err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            //verifies the route has a db entry if not sends error message
             if(!foundCamp){
                    req.flash("error", "No Campground Found");
                    return res.redirect("back");
                }
              // is user authorized to edit?
              if(foundCamp.author.id.equals(req.user._id)){
              return next();
              }
              // if not redirect
              req.flash("error", "You don't have permission to do that");
              res.redirect("back");
        }
    });
  } else {
      // if not redirect
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");   
  }
};


middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        //find comment by id 
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err){
                console.log(err);
                res.redirect("back");
            } else {
                if(!foundComment){
                    req.flash("error", "No Comment Found");
                    return res.redirect("back");
                }
              if(foundComment.author.id.equals(req.user._id)){
              next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                } 
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
     return next();   
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;