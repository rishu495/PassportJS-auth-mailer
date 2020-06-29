// require express
const express= require('express');

// require passport
const passport=require('passport');

const router=express.Router();

// require usersController
const usersController=require('../controllers/users_controller');

// Users Authentication System Route
router.get("/profile/",passport.checkAuthentication,usersController.profile);
router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);
router.get('/sign-out',usersController.signOut);
router.get('/reset-page',passport.checkAuthentication,usersController.resetPage);
router.post('/reset-password',passport.checkAuthentication,usersController.resetPassword);

router.post('/create',usersController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
),usersController.createSession);


// Google oAuth ROute
router.get('/auth/google',passport.authenticate('google', {scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);

// routes for forgot password
router.get('/forgot-enter-email',usersController.forgotEmailPage);
router.post('/forgot-password',usersController.forgotPassword);
router.get('/forgot-create-password/:id',usersController.forgotCreatePassWord);
router.post('/update-password',usersController.updatePassword);

// exporting the router
module.exports=router;