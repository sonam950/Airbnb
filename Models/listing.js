const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ListingSchema= new Schema({
    title:
    {
       type: String,
       required:true,
    },
    description:String,
     image: {
    filename: String,
    url: {
      type: String,
      default: "https://unsplash.com/photos/astronaut-floats-in-a-sea-under-a-radiant-sun-hCe286vKOqc",
      set: (v) => (v === "" ? "https://unsplash.com/photos/astronaut-floats-in-a-sea-under-a-radiant-sun-hCe286vKOqc" : v),
    },
  },
    price:Number,
    location:String,
    country:String,
    reviews :[
      {
      type:Schema.Types.ObjectId,
      }
    ],
   
})
const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;