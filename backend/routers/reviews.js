const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const ExpressErrors = require('../utils/ExpressErrors');
const { reviewSchema } = require('../utils/schema');
const { validateReview, isLoggedIn, isAuthorReview } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    review.author = req.user;
    await review.save();
    await campground.save();
    res.json(review)
}))

router.delete('/:reviewId', isLoggedIn, isAuthorReview, catchAsync(async (req, res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted successfully' })
}))

module.exports = router;