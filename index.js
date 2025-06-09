require('dotenv').config();

const mongoose=require("mongoose");
const express=require("express");
const initData=require("./data");
const listing=require("./Models/listing")
const app=express();

const uri=process.env.MONGO_URL;

 app.listen(8080,()=>{
    console.log("server is listenning")
    mongoose.connect(uri)
    .then(()=>{
        console.log("Db connected")
    })
    .catch((error)=>{
        console.log(error)
    })
 })

 const init=async()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("data initialized")
 }
 init();