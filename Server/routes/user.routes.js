const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const auth = require('../middleware/userMiddleware.js');
const role = require('../middleware/authUser.js');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user and send verification code to email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aml Sayed
 *               email:
 *                 type: string
 *                 example: aml@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully, check email for verification code
 *       400:
 *         description: Bad request / Email already registered
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /users/verify-email:
 *   post:
 *     summary: Verify user's email with the code sent to their email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: aml@example.com
 *               code:
 *                 type: string
 *                 example: "a1b2c3"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification code or bad request
 *       404:
 *         description: User not found
 */
router.post('/verify-email', userController.verifyEmail);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */
router.get('/', auth, role(['admin']), userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', auth, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', auth, userController.deleteUser);
/**
 * @swagger
 * /users/become-host:
 *   post:
 *     summary: Change user role from guest to host
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User role updated to host successfully
 *       400:
 *         description: Only guests can become hosts
 *       401:
 *         description: Unauthorized
 */
router.post('/become-host', auth, userController.becomeHost);
/**
 * @swagger
 * /users/resend-code:
 *   post:
 *     summary: Resend verification code to user's email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: aml@example.com
 *     responses:
 *       200:
 *         description: Verification code resent successfully
 *       400:
 *         description: Bad request / No verification code found
 *       404:
 *         description: User not found
 */
router.post('/resend-code', userController.resendVerificationCode);
/**
 * @swagger
 * /auth/reset/send-code:
 *   post:
 *     summary: Send reset password code to user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset code sent successfully
 *       400:
 *         description: User not found or not verified
 *       500:
 *         description: Server error
 */
router.post("/reset/send-code", userController.sendResetCode);

/**
 * @swagger
 * /auth/reset/verify-code:
 *   post:
 *     summary: Verify the reset password code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 example: "ABC123"
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid or expired code
 *       500:
 *         description: Server error
 */
router.post("/reset/verify-code", userController.verifyResetCode);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user password using a verified code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Reset process not started or invalid request
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", userController.resetPassword);

/**
 * @swagger
 * /users/profile:
 * get:
 * summary: Get current authenticated user profile
 * description: |
 * Retrieves the profile data for the authenticated user based on the ID
 * available in the request object (req.user._id) after passing through
 * the authentication middleware. It selects specific fields (FIELDS_TO_RETURN)
 * and populates the 'reviews' field.
 * tags: [User]
 * security:
 * - bearerAuth: []  # Requires an Authentication Token
 * responses:
 * 200:
 * description: User profile successfully retrieved
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * _id:
 * type: string
 * example: "60c72b1d1f0d440001a1b1c1"
 * email:
 * type: string
 * format: email
 * example: "user@example.com"
 * reviews:
 * type: array
 * items:
 * type: object
 * properties:
 * rating:
 * type: number
 * comment:
 * type: string
 * author:
 * type: string
 * # Note: Add other fields like firstName, lastName, etc., as needed based on FIELDS_TO_RETURN
 * 401:
 * description: Unauthorized (Missing or invalid token)
 * 404:
 * description: Profile data not found for the authenticated user ID
 * 500:
 * description: Server error while fetching profile
 */
router.get("/profile", auth, userController.getProfile);

router.patch('/profile', auth , userController.updateProfile);

router.post('/profile/upload', auth, userController.uploadProfilePhoto);


module.exports = router;

