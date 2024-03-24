const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
// const review = require("./models/review.js");
const review = require("./review");

const listingschema = new Schema({
    title : {
        type : String ,
        required : true 
    } , 
    description : String ,
    image : {
       url : String ,
       filename : String
    },
    price : Number ,
    location :String ,
    country : String ,

    //setting up 1*n relationship
    reviews : [{
          type : Schema.Types.ObjectId,
          ref: "Review"
    }     
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}) ;

listingschema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in :listing.reviews }})
    }
});

const listing = new mongoose.model("listing" , listingschema);
module.exports = listing ;