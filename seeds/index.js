const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});

    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const p = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '5fe42f3bc39d720e4fe9b80b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor id vitae sapiente veritatis in eos obcaecati aspernatur. Aperiam, iusto? A reiciendis, suscipit hic sunt doloremque autem cumque commodi nam sint.Hic eaque illum nemo voluptatibus explicabo itaque doloremque, rerum illo ullam incidunt culpa iure eum quae, accusamus nobis quo! Nisi id voluptas ea error aliquid quidem incidunt, dignissimos optio quaerat.',
            price: p,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmcfezt27/image/upload/v1609193254/YELPCAMP/yo2ylnsmcy6s6xyuzqs6.jpg',
                    filename: 'YELPCAMP/yo2ylnsmcy6s6xyuzqs6'
                },
                {
                    url: 'https://res.cloudinary.com/dmcfezt27/image/upload/v1609193254/YELPCAMP/zmpmr6tzqjph7bg4zlbf.jpg',
                    filename: 'YELPCAMP/zmpmr6tzqjph7bg4zlbf'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log("CONNECTION CLOSED!")
});