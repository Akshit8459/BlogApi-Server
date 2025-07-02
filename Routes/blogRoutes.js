const express=require('express')
const router=express.Router();
const auth=require('../Middlewares/authentication')
const fn=require('../Controllers/blogControls')

const {allowRoles}=require('../Middlewares/authorise')

router.get('/',auth,allowRoles("ADMIN","NORMAL"),fn.getAllBlogs)
router.get('/create',auth,allowRoles("ADMIN","NORMAL"),fn.createBlogPage)
router.post('/create',auth,allowRoles("ADMIN","NORMAL"),fn.createBlog)
router.get('/myblogs',auth,allowRoles("ADMIN","NORMAL"),fn.getMyBlogs)
router.post('/myblogs/delete/:id',auth,allowRoles("ADMIN","NORMAL"),fn.deleteBlog)

module.exports=router;