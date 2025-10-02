const express = require('express')
const route = express()

const token = require('../middleware/userMiddleware')
const paymentAuthentication = require('../middleware/authUser')

// -----PAYMENT REQUIRES    
const paymentCtrl = require('../controllers/Payment_Controllers/PaymentCtrl')
// -----PAYMENT REQUIRES    

// ----- PAYMENT ROUTES
route.post('/transactions', token, paymentCtrl.handleCreateTransactions)
route.get('/transactions', token, paymentAuthentication(['host', 'admin']), paymentCtrl.handleGetTransactions)
route.post('/checkout', token, paymentCtrl.handlePayment);
route.get('/complete', (req, res) => {
    res.send('Payment is completed');
});
route.get('/cancel', (req, res) => {
    res.send('Payment is cancelled');
});
// ----- PAYMENT ROUTES

module.exports = route;