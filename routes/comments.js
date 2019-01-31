var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=============
// Comment-New

router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comment/new", {campground: campground});  
        }
    });

});
// Comment-Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/camp");
        } else {
               Comment.create(req.body.comment, function(err, comment){
                   if(err){
                       console.log(err);
                   } else {
                       // add username and Id 
                       comment.author.id = req.user._id;
                       comment.author.username = req.user.username;
                       comment.save();
                       //save comment
                       campground.comments.push(comment);
                       campground.save();
                       res.redirect("/camp/" + campground._id);
                   }
               });
        }
    });

});
// Comment EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, comment) {
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.render("comment/edit", {campground: campground, comment: comment});
                }
            });
        }
    });
});
// Comment UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/camp/"+req.params.id);
        }
    });
});
// Comment DESTROY route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           console.log(err);
           res.redirect("back");
       } else {
           res.redirect("/camp/"+req.params.id);
       }
   }); 
});
// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()){
//      return next();   
//     }
//     res.redirect("/login");
// }
// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         //find comment by id 
//         Comment.findById(req.params.comment_id, function(err, foundComment) {
//             if (err){
//                 console.log(err);
//                 res.redirect("back");
//             } else {
//               if(foundComment.author.id.equals(req.user._id)){
//               next();
//                 } else {
//                     res.redirect("back");
//                 } 
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }


module.exports = router;