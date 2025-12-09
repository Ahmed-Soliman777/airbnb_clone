const Experience = require("../models/Experience.model");
const { uploadOnCloudinary } = require("../config/cloudinary");

// @desc    Create new experience listing
// @route   POST /api/experiences
// @access  Private
const createExperience = async (req, res) => {
  try {
    const {
      title,
      description,
      experienceType,
      street,
      city,
      country,
      coordinates,
      pricePerPerson,
      duration,
      groupSize,
      schedule,
      ageRequirement,
      fitnessLevel,
      requirements,
      inclusions,
    } = req.body;

    // Parse JSON strings back to objects
    const parsedGroupSize = groupSize ? JSON.parse(groupSize) : {};
    const parsedSchedule = schedule ? JSON.parse(schedule) : [];
    const parsedRequirements = requirements ? JSON.parse(requirements) : [];
    const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];
    const parsedCoordinates = coordinates ? JSON.parse(coordinates) : {};

    let uploadedImages = [];

    // Handle file uploads from multer
    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          try {
            return await uploadOnCloudinary(file.path);
          } catch (error) {
            console.error("Error uploading image:", error.message);
            return null;
          }
        })
      );
      uploadedImages = uploadedImages.filter(Boolean);
    }

    const experience = await Experience.create({
      title,
      description,
      experienceType,
      location: {
        street,
        city,
        country,
        coordinates: parsedCoordinates,
      },
      pricePerPerson,
      duration,
      groupSize: parsedGroupSize,
      schedule: parsedSchedule,
      ageRequirement,
      fitnessLevel,
      requirements: parsedRequirements,
      images: uploadedImages,
      inclusions: parsedInclusions,
      host: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error("Error creating experience:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
  try {
    const {
      city,
      country,
      experienceType,
      page = 1,
      limit = 10,
      priceRange,
      categories,
      minRating,
    } = req.query;

    const query = { status: "active" };

    if (city) query["location.city"] = new RegExp(city, "i");
    if (country) query["location.country"] = new RegExp(country, "i");
    if (experienceType) query.experienceType = experienceType;

    // Price range filter
    if (priceRange) {
      const [minPrice, maxPrice] = JSON.parse(priceRange);
      query.pricePerPerson = { $gte: minPrice, $lte: maxPrice };
    }

    // Categories filter
    if (categories) {
      const categoryArray = JSON.parse(categories);
      if (categoryArray.length > 0) {
        query.experienceType = { $in: categoryArray };
      }
    }

    // Rating filter (assuming you have a rating field)
    if (minRating && parseFloat(minRating) > 0) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    const experiences = await Experience.find(query)
      .populate("host", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Experience.countDocuments(query);

    res.status(200).json({
      success: true,
      count: experiences.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate(
      "host",
      "name email"
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findById(req.params.id);
    if (!experience)
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });

    if (experience.host.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to update this experience",
        });
    }

    const {
      title,
      description,
      experienceType,
      street,
      city,
      country,
      coordinates,
      pricePerPerson,
      duration,
      groupSize,
      schedule,
      ageRequirement,
      fitnessLevel,
      requirements,
      inclusions,
      status,
    } = req.body;

    // Parse JSON strings if they exist
    const parsedGroupSize = groupSize
      ? JSON.parse(groupSize)
      : experience.groupSize;
    const parsedSchedule = schedule
      ? JSON.parse(schedule)
      : experience.schedule;
    const parsedRequirements = requirements
      ? JSON.parse(requirements)
      : experience.requirements;
    const parsedInclusions = inclusions
      ? JSON.parse(inclusions)
      : experience.inclusions;
    const parsedCoordinates = coordinates
      ? JSON.parse(coordinates)
      : experience.location?.coordinates;

    let uploadedImages = experience.images;

    // Handle new file uploads from multer
    if (req.files && req.files.length > 0) {
      const newUploadedImages = await Promise.all(
        req.files.map(async (file) => {
          try {
            return await uploadOnCloudinary(file.path);
          } catch (error) {
            console.error("Error uploading image:", error.message);
            return null;
          }
        })
      );
      uploadedImages = [
        ...uploadedImages,
        ...newUploadedImages.filter(Boolean),
      ];
    }

    experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        experienceType,
        location: {
          street: street || experience.location?.street,
          city: city || experience.location?.city,
          country: country || experience.location?.country,
          coordinates: parsedCoordinates,
        },
        pricePerPerson,
        duration,
        groupSize: parsedGroupSize,
        schedule: parsedSchedule,
        ageRequirement,
        fitnessLevel,
        requirements: parsedRequirements,
        images: uploadedImages,
        inclusions: parsedInclusions,
        status,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    // Check ownership
    if (experience.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this experience",
      });
    }

    await experience.deleteOne();

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get host's experiences
// @route   GET /api/experiences/host
// @access  Private
const getHostExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ host: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExperience,
  getExperiences,
  getExperience,
  updateExperience,
  deleteExperience,
  getHostExperiences,
};
