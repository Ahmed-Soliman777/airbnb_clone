const Service = require('../models/Service.model');

// @desc    Create new service listing
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  try {
    let {
      title,
      description,
      serviceCategory,
      location,
      hourlyRate,
      packages,
      availability,
      requirements,
      skills,
      serviceDetails
    } = req.body;

    // Parse nested objects if they are strings (from FormData)
    if (typeof location === 'string') location = JSON.parse(location);
    if (typeof packages === 'string') packages = JSON.parse(packages);
    if (typeof availability === 'string') availability = JSON.parse(availability);
    if (typeof requirements === 'string') requirements = JSON.parse(requirements);
    if (typeof skills === 'string') skills = JSON.parse(skills);
    if (typeof serviceDetails === 'string') serviceDetails = JSON.parse(serviceDetails);

    // Handle images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: file.originalname
      }));
    }

    const service = await Service.create({
      title,
      description,
      serviceCategory,
      location,
      hourlyRate,
      packages,
      availability,
      requirements,
      skills,
      images,
      serviceDetails,
      host: req.user._id
    });

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { city, country, serviceCategory, page = 1, limit = 10 } = req.query;

    const query = { status: 'active' };

    if (city) query['location.city'] = new RegExp(city, 'i');
    if (country) query['location.country'] = new RegExp(country, 'i');
    if (serviceCategory) query.serviceCategory = serviceCategory;

    const services = await Service.find(query)
      .populate('host', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('host', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    const {
      title,
      description,
      serviceCategory,
      serviceArea,
      city,
      country,
      coordinates,
      hourlyRate,
      packages,
      availability,
      requirements,
      skills,
      images,
      serviceDetails,
      status
    } = req.body;

    service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        serviceCategory,
        location: {
          serviceArea,
          city,
          country,
          coordinates
        },
        hourlyRate,
        packages,
        availability,
        requirements,
        skills,
        images,
        serviceDetails,
        status
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get host's services
// @route   GET /api/services/host
// @access  Private
const getHostServices = async (req, res) => {
  try {
    const services = await Service.find({ host: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getHostServices
};
