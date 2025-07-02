const db=require('../Models/posts')

exports.getAllBlogs=async (req,res)=>{
    try{
        const blogs=await db.find({}).sort({date:-1}).populate('user');
        if(!blogs || blogs.length==0) return res.render("UserDashboard",{message:"no blogs found yet",items:null})
        const items = blogs.map(blog => {
            return `
                <div class="blog-card">
                    <div class="blog-title">${blog.title}</div>
                    <div class="blog-meta">By ${blog.user.name} | ${new Date(blog.date).toDateString()}</div>
                    <div class="blog-content">${blog.content}</div>
                </div>
            `;
        }).join("");
        res.render("UserDashboard",{message:null,items});
        
    }catch(e){
        res.status(400).json({message:"error while getting blogs",error:e.message})
    }
}

exports.createBlog=async (req,res)=>{
    try{
        const {title,content}=req.body
        const userId=req.user.id
        const blog = await db.create({
            title,
            content,
            user: userId,
            date: Date.now(), // Add creation date here
        });
        if(!blog) return res.status(400).send("Error while creating a blog")
        res.status(200).redirect('/blogs')
    }catch(e){
        res.status(400).json({message:"error while Creating a blog",error:e.message})
    }
}

exports.createBlogPage=async (req,res)=>{
    res.render("CreateBlog")
}

exports.getMyBlogs=async (req,res)=>{
    try{
        const userId=req.user.id
        const blogs=await db.find({user:userId})
        if(!blogs || blogs.length==0) return res.status(400).send("No blogs found for the user")
        res.status(200).render("MyBlogs",{blogs})
    }catch(e){
        res.status(400).json({message:"error while fetching  blogs",error:e.message})
    }
}

exports.deleteBlog=async (req,res)=>{
    try{
        const userId=req.user.id
        const blogId=req.params.id
        const blog=await db.findByIdAndDelete(blogId);
        if(!blog) return res.status(400).send("No such blog was found")
        res.status(200).redirect('/blogs/')
    }catch(e){
        res.status(400).json({message:"Error while deleting the blog",error:e.message})
    }
}