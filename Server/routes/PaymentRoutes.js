const express = require('express')
const route = express()

// -----PAYMENT REQUIRES    
const paymentCtrl = require('../controllers/Payment_Controllers/PaymentCtrl')
// -----PAYMENT REQUIRES    

// ----- PAYMENT ROUTES
route.post('/api/g2/transactions', paymentCtrl.handleCreateTransactions)
route.get('/api/g2/transactions', paymentCtrl.handleGetTransactions)
route.post('/api/g2/checkout', paymentCtrl.handlePayment);
route.get('/api/g2/complete', (req, res) => {
    res.send('Payment is completed');
});
route.get('/api/g2/cancel', (req, res) => {
    res.send('Payment is cancelled');
});
// ----- PAYMENT ROUTES

module.exports = route;