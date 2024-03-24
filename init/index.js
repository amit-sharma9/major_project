const mongoose = require('mongoose');
const listing = require("../models/listing.js");
const initdb = require ("./data.js");
main()
    .then(() => {
        console.log("connection succesful");
    }).catch((err) => {
        console.log(err)
    });
    async function main() {
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    };

const initialize = async ()=>{
    await listing.deleteMany({});
  initdbn =   initdb.map((obj)=> ({...obj , owner : "65ce77d77fecc4c93dadd4c2"}))
    await listing.insertMany(initdbn);
    console.log("success");
}
initialize();