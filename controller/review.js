const listing = require("../models/listing.js");
const review = require("../models/review.js");


module.exports.reviewCreate =  async (req, res) => {
    let data = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    data.reviews.push(newReview);
    await newReview.save();
    await data.save();
    req.flash("success" , "Review Added!");
   res.redirect(`/listings/${data._id}`);
  }

module.exports.reviewDestroy = async(req,res)=>{
    let {id , reviewid} = req.params;
    await listing.findByIdAndUpdate( id , {$pull : {reviews: reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success" , "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }