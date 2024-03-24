require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");


//for local mongodb
const mongourl = "mongodb://127.0.0.1:27017/wanderlust";

//for mongo atlas
const atlasurl = process.env.ATLAS_DB_URL;


//for connect mongo
//for connect mongo
const MongoStore = require('connect-mongo');
const store = MongoStore.create({
  mongoUrl: atlasurl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter : 24*3600 ,
});

store.on("error" ,()=>{
  console.log("error in mongo atlas is " , err);
})

//for image upload
const multer  = require('multer');
const {storage} = require("./cloudConfig.js");
const upload = multer({storage});

//MVC implemented
const listingController = require("./controller/listing.js");
const reviewController = require("./controller/review.js");
const userController = require("./controller/user.js");

//for express session 
const sessionOptions = {
  store,
  secret : process.env.SECRET ,
  resave : false ,
  saveUninitialized : true
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new Localstrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for flash all around
app.use((req,res,next)=>{
  res.locals.succMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

main()
  .then(() => {
    console.log("connection succesful");
  })
  .catch((err) => {
    console.log(err);
  });
  async function main() {
    await mongoose.connect(atlasurl);
  }

//middlewares
const isLoggedin = (req , res , next)=>{
  if (!req.isAuthenticated()) {
    req.session.originalurl = req.originalUrl;
    req.flash("error" , "You must be logged in to do this");
    res.redirect("/login");
  }
  next();
}

const savedurl = (req , res , next)=>{
if (req.session.originalurl) {
  res.locals.gotourl = req.session.originalurl;
}
next();
}


//for ejs mate
app.engine("ejs", ejsMate);

//to parse req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//for overriding
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//for static files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ------------------------------
//for login
app.get("/login",userController.loginpage);

app.post("/login" ,savedurl ,passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true}) ,userController.loginCheck)

//for signup 
app.get("/signup", userController.signupPage);

app.post("/listings/signup", userController.signup);

//for logout
app.get("/logout" ,userController.logout);
// -----------------------------------------------------------------


//show ALL listings
app.get("/listings", listingController.showListings );


//update listing
app.put("/listings/:id",isLoggedin ,upload.single('image'), listingController.updateListing);

//delete listing
app.delete("/listings/:id",isLoggedin , listingController.destroyListing);

//New route
app.get("/listings/new",isLoggedin , listingController.newListing);

//show route
app.get("/listings/:id",listingController.infoListing);


//Create route
app.post("/listings",upload.single('image'),listingController.createListing);

//edit 
app.get("/listings/:id/edit",isLoggedin ,listingController.editListing);

//review add
app.post("/listings/:id/review",isLoggedin ,reviewController.reviewCreate);

//review delete
app.delete("/listings/:id/review/:reviewid",reviewController.reviewDestroy);

app.use((err, req, res, next) => {

  // Check if headers have been sent
  if (!res.headersSent) {
    res.status(500).send("Something went wrong");
    console.log(err);
  } 
  //else {
  //   // If headers have already been sent, log the error and move on
  //   console.error("Headers already sent, skipping response");
  // }
});

// app.use((err, req, res, next) => {
//   // console.log(err);
//   res.send("something went wrong");
// });
app.listen(3000, () => {
  console.log("app is listening");
});

