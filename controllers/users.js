const User = require('../models/user');

module.exports.renderRegister = (req, res)=> {
    res.render('users/register');
}

module.exports.register = async (req, res, next)=> {
    try {
        const {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success','welcome to yelpcamp');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
    // console.log(registeredUser);
}

module.exports.renderLogin = (req, res)=> {
    res.render('users/login');
};

module.exports.login = (req, res)=>{
    // console.log(req.body);
    const{username} = req.body;
    req.flash('success', `welcome back, ${username}`);
    const redirectUrl = req.session.returnTo ||'/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res)=> {
    req.logout();
    req.flash('error', 'You have logged out');
    res.redirect('/campgrounds');
}