var express = require("express");
var router = express.Router();
//var methodOverride = require("method-override");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// INDEX route - a list of all the db entries
router.get("/", function(req,res){
    //get all campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campground/index", {data: allCampgrounds} );
        }
    });
});

// CREATE route - add entry to db  
router.post("/", middleware.isLoggedIn, function(req, res){
    var name= req.body.name;
    var price= req.body.price;
    var imgUrl= req.body.imgUrl;
    var discription= req.body.discription;
    var author= {
        id: req.user._id,
        username: req.user.username
    };
    //get data and add to campgrounds page
    var newObject= {name: name, price: price, imgUrl: imgUrl, discription: discription, author: author};
    //create a new campground and save to db
    Campground.create(newObject, function(err, newly){
        if(err){
            console.log(err);
        } else {
            //redirect to campgrounds page
            res.redirect("/camp");  
        }
    });

    
});
// NEW Route - Form for creating a new route 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campground/new"); 
});

// SHOW route - Shows more info about each campground
router.get("/:id", function(req, res){

    // find campground with id 
    //var id = req.params.id;
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            // render the content with that id
            //console.log(foundCamp);
                res.render("campground/show", {campground: foundCamp});
        }
    });
});
// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {

      // find campground with id
          Campground.findById(req.params.id, function(err, foundCamp){
              res.render("campground/edit", {campground: foundCamp});
    });
   
});
// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCamp){
        if(err){
            res.redirect("/camp");
            console.log(err);
        } else {
            res.redirect("/camp/"+req.params.id);
        }
    });
});
//Destroy Route 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/camp");
        } else {
            res.redirect("/camp");
        }
    });
});
// Middleware
// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()){
//      return next();   
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next){
//       if (req.isAuthenticated()){
//       // find campground with id
//           Campground.findById(req.params.id, function(err, foundCamp){
//         if (err){
//             //res.redirect("back");
//         } else {
//               // is user authorized to edit?
//               if(foundCamp.author.id.equals(req.user._id)){
//               return next();
//               }
//               // if not redirect
//               res.redirect("back");
//         }
//     });
//   } else {
//       // if not redirect
//         res.redirect("back");   
//   }
// }
module.exports = router;