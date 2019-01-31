var express                 = require("express"),
    app                     = express(),
//    request                 = require("request"),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    flash                   = require("connect-flash"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
//    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
//    Campground              = require("./models/campground"),
//    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds");
var commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campground"),
    indexRoutes             = require("./routes/index");
//console.log(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/yelp_camp_v12p1");
//mongoose.connect("mongodb://todd:todd25@ds223812.mlab.com:23812/yelpcamptodd");
mongoose.connect(process.env.DATABASEURL);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");


//seedDB(); // seed the Dbs

// Passport Config
app.use(require("express-session")({
    secret: "fin is a loud cat, luna is a scaredy cat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//routes
//=============
app.use(("/"), indexRoutes);
app.use(("/camp"), campgroundRoutes);
app.use(("/camp/:id/comments"), commentRoutes);
//=============
//start the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server is Up");
});