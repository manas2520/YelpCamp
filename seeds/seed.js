const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// mongoose setup
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error : '));
db.once('open', () => {
    console.log('Database connected');
});

// function to extract a random element from the array
const sample = (ar) => {
    let randomInt = Math.floor(Math.random() * ar.length);
    return ar[randomInt];
}

const seedDB = async () => {
    // deleting pre-existing data
    await Campground.deleteMany({});
    console.log('Previous data deleted');
    // Here, we are seeding 50 camps into our database by randomly generating a number,then using it to decide the location(using cities.js) and name(once again by randomly selecting a descriptor and place from seedHelpers.js)
    console.log('Seeding started');
    let count = 0;
    for (let i = 0; i < 50; i++) {
        // If confused, refer to the schema
        const location = sample(cities);
        const descriptor = sample(descriptors);
        const place = sample(places);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${descriptor} ${place}`,
            location: `${location.city}, ${location.state}`,
            image: 'https://source.unsplash.com/collection/483251',
            price: price,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores animi eius fugiat expedita quasi hic, in laborum voluptatem porro est? Dolores reiciendis a rem consequuntur laboriosam odio deserunt tenetur odit.',
        });
        await camp.save();
        count++;
    }
    console.log('Seeding completed');
    console.log(`${count} camps seeded`);
};

seedDB()
    .then(() => {
        mongoose.connection.close();
    });