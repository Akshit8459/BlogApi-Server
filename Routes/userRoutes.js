const express=require('express')
const router=express.Router();
const fn=require('../Controllers/userControls')

const auth=require('../Middlewares/authentication')
const {allowRoles}=require('../Middlewares/authorise')
//Login Signup & Logout Routes
router.get('/Login',fn.loginPage)
router.get('/Signup',fn.signupPage)
router.post('/Login',fn.LoginUser)
router.post('/Signup',fn.SignupUser)
router.get('/logout',auth,fn.logout);

//Admin Routes
router.get('/admin/',auth,allowRoles("ADMIN"),fn.getAllUsers);
router.get('/admin/user',auth,allowRoles("ADMIN"),fn.getSingleUser)
router.post('/admin/:email',auth,allowRoles("ADMIN"),fn.deleteUser)

module.exports=router;