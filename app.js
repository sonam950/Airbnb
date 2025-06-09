require('dotenv').config()

const express = require('express')
const app = express();
const mongoose = require('mongoose');
const Listing = require("./Models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync");
const expressError = require("./utils/ExpressError");
const Review = require('./Models/reviews');
const ExpressError = require('./utils/ExpressError');
const User = require('./Models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userRoutes = require('./route/user');
const session = require('express-session');
const flash = require('connect-flash');
const uri = process.env.MONGO_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);   
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.redirect("/listings");
})
const sessionOptions = {
  secret: 'thisShouldBeASecretKey', // 🔒 Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.use('/', userRoutes); // now /signup is available

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("Listing/index.ejs", { allListings });

})

//  new route
app.get("/listings/new", (req, res) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    res.render("Listing/new.ejs");
})

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    console.log("helo")
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("Listing/show.ejs", { listing });
}))
// create route 
app.post("/listings", wrapAsync(async (req, res, next) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"send valid data for listing")
    }
    const newListing = new Listing(req.body.Listing);

    await newListing.save();
    res.redirect("/listings")
})
);

app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("Listing/edit.ejs", { listing })
}))
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}))
app.delete("/listings/:id/delete", async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})

app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newreview = new Review(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("review");
    // res.send("review added successfully");
    res.redirect(`/listings/${listing._id}`);

}))
// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By  he beach",
//         price:1200,
//         location:"Calagute,Goa",
//         country:"india"

//     })
//     await sampleListing.save();
//     console.log("sample is saved");
//     res.send("successfull");
// })

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
}); 
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("server is listenning")
    mongoose.connect(uri)
        .then(() => {
            console.log("Db connected")
        })
        .catch((error) => {
            console.log(error)
        })
})
