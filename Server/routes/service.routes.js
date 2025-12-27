const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getHostServices,
  getServiceStats
} = require('../controllers/service.controller.js');
const auth = require('../middleware/userMiddleware.js');
const { default: upload } = require('../middleware/multer.js');

// Public routes
router.get('/stats', getServiceStats);
router.get('/', getServices);

// Protected routes (require authentication)
router.get('/host/my-services', auth, getHostServices);
router.get('/:id', getService);

// Protected routes (require authentication)
router.post('/', auth, upload.array('images', 10), createService);
router.put('/:id', auth, upload.array('images', 10), updateService);
router.delete('/:id', auth, deleteService);


module.exports = router;
