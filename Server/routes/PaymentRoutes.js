const express = require('express')
const route = express()

const token = require('../middleware/userMiddleware')
const paymentAuthentication = require('../middleware/authUser')

// -----PAYMENT REQUIRES    
const paymentCtrl = require('../controllers/Payment_Controllers/PaymentCtrl')
// -----PAYMENT REQUIRES    

// ----- PAYMENT ROUTES
route.post('/api/g2/transactions', token, paymentCtrl.handleCreateTransactions)
route.get('/api/g2/transactions', token, paymentAuthentication(['host', 'admin']), paymentCtrl.handleGetTransactions)
route.post('/api/g2/checkout', token, paymentCtrl.handlePayment);
route.get('/api/g2/complete', (req, res) => {
    res.send('Payment is completed');
});
route.get('/api/g2/cancel', (req, res) => {
    res.send('Payment is cancelled');
});
// ----- PAYMENT ROUTES

module.exports = route;