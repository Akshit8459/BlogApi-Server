const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    user:{type:mongoose.Types.ObjectId,ref:'User',required:true},
    date:{type:Date,required:true,default:Date.now},
})

module.exports=mongoose.model('Post',postSchema);