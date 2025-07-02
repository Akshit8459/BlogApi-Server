const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.generateToken=(userData)=>{
    try{
        return jwt.sign(userData,process.env.SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'1d'})
    }catch(e){
        console.log("Error while Generating User Token:",e.message)
        return null;
    }
}

exports.verifyToken=(token)=>{
    try{
        return jwt.verify(token,process.env.SECRET)
    }catch(e){
        console.log("Error while Verifying User Token:",e.message)
        return null;
    }
}