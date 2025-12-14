const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
if (!process.env.MONGODB_URL) require('dotenv').config();

const User = require('../models/User.model');
const Listing = require('../models/Listing.model');
const Service = require('../models/Service.model');
const Experience = require('../models/Experience.model');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const users = await User.find({}, '_id email firstName lastName');
        console.log("\n--- Users ---");
        users.forEach(u => console.log(`${u._id}: ${u.email}`));

        const listings = await Listing.find({}, '_id title hostId');
        console.log(`\n--- Listings (${listings.length}) ---`);
        listings.forEach(l => console.log(`${l._id}: (Host: ${l.hostId})`));

        const services = await Service.find({}, '_id title host');
        console.log(`\n--- Services (${services.length}) ---`);
        services.forEach(s => console.log(`${s._id}: (Host: ${s.host})`));

        const experiences = await Experience.find({}, '_id title host');
        console.log(`\n--- Experiences (${experiences.length}) ---`);
        experiences.forEach(e => console.log(`${e._id}: (Host: ${e.host})`));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
