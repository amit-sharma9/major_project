const User = require("../models/user.js");

module.exports.loginpage = (req, res) => {
    res.render("./listings/login.ejs");
  }

module.exports.loginCheck =async(req,res)=>{
    req.flash("success" , "Welcome back to WanderLust!");
    let gotourl = res.locals.gotourl || "/listings";
    res.redirect(gotourl);
    }

module.exports.signupPage = (req, res) => {
    res.render("./listings/signup.ejs");
  }

module.exports.signup = async (req, res) => {
    try{
      let {username , email ,password} = req.body;
      let newUser = new User({username,email});
      const registereduser = await User.register(newUser , password);
      console.log(registereduser);
      req.login(registereduser ,(err)=>{
        if (err) {
         return next(err);
        }
        req.flash("success" , "Welcome to WanderLust!");
        res.redirect("/listings");
      });
    }
  catch(e){
  req.flash("error" , e.message);
  res.redirect("/signup");
  }
  };

module.exports.logout = (req ,res)=>{
    req.logout((err)=>{
      if (err) {
      return  next(err);
      }
      req.flash("success" , "Successfully Logged out!");
      res.redirect("/listings");
    })
  }