const express = require('express');
const route = express();
const paymentCtrl = require('../controllers/Payment_Controllers/PaymentCtrl');
const token = require('../middleware/userMiddleware');
const paymentAuthentication = require('../middleware/authUser');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment and transaction management
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction profile for a user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User ID to create transaction profile
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID for whom the transaction profile is created
 *     responses:
 *       201:
 *         description: Transaction profile created
 *       400:
 *         description: Missing userId
 *       401:
 *         description: Access denied
 */
route.post('/transactions', token, paymentCtrl.handleCreateTransactions);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transaction profiles (host/admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transaction profiles
 *       401:
 *         description: Access denied
 */
route.get('/transactions', token, paymentAuthentication(['host', 'admin']), paymentCtrl.handleGetTransactions);

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create a Stripe checkout session and reservation
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Payment and reservation details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceName
 *               - roomType
 *               - checkIn
 *               - checkOut
 *               - guests
 *               - price
 *               - userId
 *             properties:
 *               serviceName:
 *                 type: string
 *               roomType:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: number
 *               price:
 *                 type: number
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout session created, returns session URL and reservation ID
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Access denied
 */
route.post('/checkout', token, paymentCtrl.handlePayment);

/**
 * @swagger
 * /complete:
 *   get:
 *     summary: Payment completed page
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment is completed
 */
route.get('/complete', (req, res) => {
    res.send('Payment is completed');
});

/**
 * @swagger
 * /cancel:
 *   get:
 *     summary: Payment cancelled page
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment is cancelled
 */
route.get('/cancel', (req, res) => {
    res.send('Payment is cancelled');
});

module.exports = route;
