const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cities = require('./cities');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');

app.use(cors()); 
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++){
        const random100 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '69458728bb4d273f8a07e28b',
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(places)} ${sample((descriptors))}`,
            description: 'Vai lon',
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/djf2f3epo/image/upload/v1766416185/cld-sample-2.jpg',
                    filename: 'YelpCamp/x4mcsoollxy45wk18rsv',
                },
                {
                    url: 'https://res.cloudinary.com/djf2f3epo/image/upload/v1766416182/samples/coffee.jpg',
                    filename: 'YelpCamp/qls8rpiwv45yo0ponjyk',
                }
        ]
        })
        await camp.save();
    }
}

seedDB();