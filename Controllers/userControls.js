const db=require('../Models/users');
const bcrypt=require('bcryptjs')

const jwtfunc=require('../Utils/jwt')


//login & logout controls
exports.SignupUser=async (req,res)=>{
    try{
        const {name,email,password}=req.body
        const SaltRounds=10;
        const passwordHash=await bcrypt.hash(password,SaltRounds);
        const userData={name,email,passwordHash,role:"NORMAL"}
        const user=await db.create(userData);
        if(!user) return res.status(400).send("Cannot create user please try again!")
        res.status(200).redirect("/users/login");
    }catch(e){
        res.status(400).json({message:"Error while Signing up the user",error:e.message})
    }
}

exports.LoginUser=async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await db.findOne({email:email});
        if(!user) return res.status(400).send("No Such User Was Found")
        const pass=await bcrypt.compare(password,user.passwordHash)
        if(!pass) return res.status(400).send("Password Doesn't match for the email")
        //assign cookie / token to the user (authentication)
        const token=jwtfunc.generateToken({email:user.email,name:user.name,role:user.role,id:user._id})
        res.cookie("authToken",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.status(200).redirect('/blogs')
        
    }catch(e){
        res.status(400).json({message:"Error while Login by the user",error:e.message})
    }
}

exports.loginPage=async (req,res)=>{
    res.render("Login");
}

exports.signupPage=async (req,res)=>{
    res.render("Signup");
}

exports.dashboardPage=async (req,res)=>{
    res.render("UserDashboard")
}

exports.logout=async (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/');
}

//Admin User Controls
exports.getAllUsers=async (req,res)=>{
    try{
        const users=await db.find({}).populate('posts')
        if (!users || users.length === 0) return res.status(400).send("No users found");
        const items = users.map(user => {
            const posts = user.posts.map(post => `<li>${post.title}</li>`).join("");
            return `
                <div class="user-card">
                    <div class="user-actions">
                        <form action="/users/admin/${user.email}" method="POST" onsubmit="return confirm('Are you sure you want to delete this user?');">
                            <button type="submit" class="delete-btn">Delete</button>
                        </form>
                        <a href="/users/admin/user?email=${encodeURIComponent(user.email)}" class="view-btn">View</a>
                    </div>
                    <div class="user-details-wrapper">
                        <div class="user-detail"><strong>Name:</strong> ${user.name}</div>
                        <div class="user-detail"><strong>Email:</strong> ${user.email}</div>
                        <div class="user-detail"><strong>Role:</strong> ${user.role}</div>
                        <div class="user-detail"><strong>Posts:</strong></div>
                        <ul>${posts || "<li>No posts</li>"}</ul>
                    </div>
                </div>
            `;
        }).join("");
        res.status(200).render("AdminDashboard",{items});
    }
    catch(e){
        res.status(400).json({message:"Error while fetching All Users",error:e.message})
    }
}

exports.getSingleUser=async (req,res)=>{
    try{
        const user=await db.findOne({email:req.query.email}).populate('posts')
        if(!user) return res.status(400).send("NO SUCH USER FOUND")
        res.status(200).render("ViewSingleUser",{name:user.name,email:user.email,role:user.role,posts:user.posts,userId: user._id.toString()})
    }catch(e){
        res.status(400).json({message:"Error while fetching All Users",error:e.message})
    }
}

const blogdb=require('../Models/posts')
exports.deleteUser=async (req,res)=>{
    try{
        const user=await db.findOneAndDelete({email:req.params.email})
        if(!user) return res.status(400).send("No Such User was found")
        const id=user._id;
        await blogdb.deleteMany({user:id})
        res.status(200).redirect('/users/admin')
    }catch(e){
        res.status(400).json({message:"Error while Deleting a User",error:e.message})
    }
}