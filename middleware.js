const { campgroundSchema,reviewSchema } = require('./schema');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        // console.log(req.originalUrl);
        req.flash('error', 'You must log in first');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    // console.log(req.body);
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req,res, next) =>{
    const{id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot Find That Campground!');
        return res.redirect('/campgrounds');
    }
    if (!campground.author._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    } else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res, next) =>{
    const{reviewId, id} = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Cannot Find That review!');
        return res.redirect('/campgrounds');
    }
    if (!review.author._id.equals(req.user._id)) {
        req.flash('error', "You do not have permission to delete other's review");
        return res.redirect(`/campgrounds/${id}`);
    } else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}