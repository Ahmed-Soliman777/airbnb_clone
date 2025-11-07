const express = require("express");
const {
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/review.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews
 */

/**
 * @swagger
 * /review:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listingId
 *               - rating
 *               - comment
 *             properties:
 *               listingId:
 *                 type: string
 *                 description: ID of the listing being reviewed
 *               rating:
 *                 type: number
 *                 description: Rating given (1-5)
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *                 example: Great place to stay!
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/review", createReview);

/**
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Get all reviews for a listing
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Listing ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the listing
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   listingId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No reviews found
 */
router.get("/review/:id", getReviews);

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/review/:id", deleteReview);

module.exports = router;
