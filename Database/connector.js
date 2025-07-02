const mongoose=require('mongoose')
require('dotenv').config();

const connect= async()=>{
    mongoose.connect(process.env.URL)
    .then(console.log("Successfully connected to Database"))
    .catch(e=>{console.log(`error while connecting to database : ${e.message}`)})
};

module.exports=connect;