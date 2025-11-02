//----
// THIS IS A MODEL FOR RESERVATIONS / BOOKING MADE BY USERS
//----
const mongoose = require('mongoose')
const reservationSchema = new mongoose.Schema({
    // serviceType: { type: String, enum: ['home', 'experience', 'service'] }, required: true,
    //serviceProvider: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true }, // reference to the service provider (host name , details) (host, experience host, service provider) 
    serviceName: String, // name of the service booked
    roomType: String, // for homes
    serviceDate: Date,// for experiences and services
    checkIn: Date, // for homes
    checkOut: Date, // for homes
    guests: Number, // for homes
    location: String, // for services
    freeCancellation: Boolean, // for services but handle it with date logic (ex: free canelaition before 25 october 2025 => [selected data])
    // isAvailable: { type: Boolean, default: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true }, // reference to user who made the booking
    // listing: { type: mongoose.Schema.Types.ObjectId, refPath: 'service', required: true }, // reference to the booked listing (home, experience, service)
    // price: { type: Number, required: true }, // reference from listing to service price at the time of booking
    paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    stripeSessionId: String // transaction id reference
}, { timestamps: true });

const reservationModel = mongoose.model('reservationModel', reservationSchema)
module.exports = { reservationModel }