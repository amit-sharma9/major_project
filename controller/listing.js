const listing = require("../models/listing.js");

module.exports.showListings = async (req, res) => {
  let datas = await listing.find();
  res.render("./listings/all.ejs", { datas });
};

module.exports.updateListing = async (req, res, next7) => {
  try {
    let { id } = req.params;
    const data = req.body;

    console.log(data);
    let Listing = await listing.findByIdAndUpdate(id, {
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      country: data.country,
    });
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      Listing.image = { url, filename };
      await Listing.save();
    }

    req.flash("success", "Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
    // res.send("error occured");
  }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.newListing = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.infoListing = async (req, res) => {
  let { id } = req.params;
  let data = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  res.render("./listings/info.ejs", { data });
};

module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    let data = req.body;

    const nlisting = new listing({
      title: data.title,
      description: data.description,
      image: { url, filename }, // Use url and filename here
      price: data.price,
      location: data.location,
      country: data.country,
      owner: req.user._id,
    });
    console.log(nlisting);
    await nlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    // Pass the error to the next middleware
    next(err);
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let data = await listing.findById(id);
  res.render("./listings/edit.ejs", { data });
};
