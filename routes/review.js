const express = require('express');
const router = express.Router({mergeParams: true}); //to send :id to review model
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');



// write a review 
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
