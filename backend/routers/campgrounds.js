const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressErrors = require('../utils/ExpressErrors');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const multer = require('multer');
const { storage } = require('../cloudinary')
// const upload = multer({dest: 'uploads/'})
const upload = multer({storage})


router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.json(campgrounds);
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate('author')
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
                select: 'username'
            }
        });
    res.json(campground);
}))

router.post('/', isLoggedIn, validateCampground, upload.array('images', 10), catchAsync(async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        throw new ExpressError('Could not geocode that location. Please try again and enter a valid location.', 400);
    }   
    const campground = new Campground(req.body);
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user;
    await campground.save();
    // console.log(req.body);
    // console.log(req.files)
    res.json(campground);
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, upload.array('images', 10), catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        throw new ExpressError('Could not geocode that location. Please try again and enter a valid location.', 400);
    } 

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });

    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    res.json(campground);
}))


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.json({ message: 'Campground deleted successfully' });
}))

module.exports = router;
