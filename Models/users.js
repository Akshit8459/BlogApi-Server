const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,trim:true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }},
    passwordHash:{type:String,required:true},
    role:{type:String,enum:["NORMAL","ADMIN"],default:"NORMAL"},
    posts:[{type:mongoose.Types.ObjectId,ref:'Post'}]
})

module.exports=mongoose.model('User',userSchema);