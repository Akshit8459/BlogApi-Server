const jwtfn=require('../Utils/jwt')

module.exports=async (req,res,next)=>{
    try{
        const token=req.cookies?.authToken;
        if(!token)return res.status(401).render("Login", { error: "Please log in to access this page." });
        const decodedValues=jwtfn.verifyToken(token)
        req.user=decodedValues;
        next();
    }catch(e){
        res.status(404).json({message:"Error wile authenticating jwt cookie",error:e.message})
    }
}