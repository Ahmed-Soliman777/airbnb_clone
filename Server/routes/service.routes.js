const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getHostServices
} = require('../controllers/service.controller.js');
const auth = require('../middleware/userMiddleware.js');

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Protected routes (require authentication)
router.post('/', auth, createService);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);
router.get('/host/my-services', auth, getHostServices);

module.exports = router;
