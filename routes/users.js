const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users')
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), users.login)

router.get('/logout', users.logout)


//edit the password, email etc
router.get('/edit', isLoggedIn, (req, res)=> {
    res.render('users/edit');
})

router.put('/edit', isLoggedIn, catchAsync(async (req,res)=>{
    try {
        const {username, email, password} = req.body;
        const user = await User.findOne({username:username});
        if (!user||user.email!==email) {
            throw new ExpressError('Username or email not correct', 404);
        } else {
            // user.setPassword(password).then(() => {
            //     user.save().then(()=>{
            //         req.flash('success', 'You have changed your info');
            //         res.redirect('/campgrounds');
            //     })
            // })
            await user.setPassword(password);
            await user.save();
            req.flash('success', 'You have changed your info');
            res.redirect('/campgrounds');
        }
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/edit');
    }
}));
module.exports = router;