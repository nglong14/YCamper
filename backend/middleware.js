const { campgroundSchema, reviewSchema } = require('./utils/schema.js');
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const ExpressErrors = require('./utils/ExpressErrors');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('isLoggedIn check - authenticated:', req.isAuthenticated());
    // console.log('req.user:', req.user);
    if (!req.isAuthenticated()){
        return res.status(401).json({ message: "You must be logged in!" });
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        return res.status(404).json({ message: "Campground not found!" });
    }
    // Convert both to strings for a reliable comparison
    if (campground.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not allowed to do that!" });
    }
    next();
}

module.exports.isAuthorReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found!" });
    }
    if (review.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not allowed to do that!" });
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressErrors(msg, 400))
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressErrors(msg, 400))
    }
    next();
}


