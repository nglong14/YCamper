const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressErrors = require('../utils/ExpressErrors');
const Campground = require('../models/campground');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const location = campground.location;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
    const prompt = `Act as a tour guide for campers. List interesting places and activities near ${location} that would be great for camping visitors. Include hiking trails, scenic viewpoints, nearby attractions, and outdoor activities. Format as a numbered list.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
        success: true,
        campgroundId: id,
        location: location,
        guide: text 
    });
});

module.exports = router;
