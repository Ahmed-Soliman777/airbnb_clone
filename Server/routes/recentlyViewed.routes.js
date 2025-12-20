const express = require("express");
const router = express.Router();

const auth = require("../middleware/userMiddleware");
const {
  getRecentlyViewed,
  addRecentlyViewed,
  clearRecentlyViewed,
} = require("../controllers/recentlyViewed.controller");

/**
 * @swagger
 * tags:
 *   name: RecentlyViewed
 *   description: User's recently viewed listings
 */

/**
 * @swagger
 * /recently-viewed:
 *   get:
 *     summary: Get user's recently viewed listings
 *     tags: [RecentlyViewed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recently viewed listings
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, getRecentlyViewed);

/**
 * @swagger
 * /recently-viewed/{listingId}:
 *   post:
 *     summary: Add a listing to recently viewed
 *     tags: [RecentlyViewed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID to add to recently viewed
 *     responses:
 *       201:
 *         description: Added to recently viewed
 *       404:
 *         description: Listing not found
 *       401:
 *         description: Unauthorized
 */
router.post("/:listingId", auth, addRecentlyViewed);

/**
 * @swagger
 * /recently-viewed:
 *   delete:
 *     summary: Clear user's recently viewed history
 *     tags: [RecentlyViewed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recently viewed history cleared
 *       401:
 *         description: Unauthorized
 */
router.delete("/", auth, clearRecentlyViewed);

module.exports = router;
