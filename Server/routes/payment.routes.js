const express = require("express");
const route = express();
const paymentCtrl = require("../controllers/payment.controller.js");
const token = require("../middleware/userMiddleware.js");
const paymentAuthentication = require("../middleware/authUser.js");

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
route.post("/transactions", token, paymentCtrl.handleCreateTransactions);

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
route.get(
  "/transactions",
  token,
  paymentAuthentication(["host", "admin"]),
  paymentCtrl.handleGetTransactions
);

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
route.post("/checkout", token, paymentCtrl.handlePayment);

/**
 * @swagger
 * /payment/verify/{sessionId}:
 *   get:
 *     summary: Verify Stripe payment session and update booking status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe checkout session ID
 *     responses:
 *       200:
 *         description: Payment verification result
 *       400:
 *         description: Missing session ID
 *       404:
 *         description: Session or booking not found
 *       401:
 *         description: Unauthorized
 */
route.get("/payment/verify/:sessionId", paymentCtrl.verifyPayment);

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
route.get("/complete", (req, res) => {
  res.send("Payment is completed");
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
route.get("/cancel", (req, res) => {
  res.send("Payment is cancelled");
});

module.exports = route;
