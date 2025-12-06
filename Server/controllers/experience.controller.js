const Experience = require('../models/Experience.model');
const { uploadOnCloudinary } = require('../config/cloudinary');

// @desc    Create new experience listing
// @route   POST /api/experiences
// @access  Private
const createExperience = async (req, res) => {
    try {
        const {
            title,
            description,
            experienceType,
            location,
            pricePerPerson,
            duration,
            groupSize,
            schedule,
            ageRequirement,
            fitnessLevel,
            requirements,
            images,
            inclusions
        } = req.body;

        let uploadedImages = [];

        if (images && Array.isArray(images) && images.length > 0) {
            // Upload all images in parallel
            uploadedImages = await Promise.all(
                images.map(async (img) => {
                    let base64Image = img;

                    if (!base64Image.startsWith("data:image")) {
                        base64Image = "data:image/jpeg;base64," + base64Image;
                    }

                    try {
                        return await uploadOnCloudinary(base64Image);
                    } catch (error) {
                        console.error(error.message);
                        return null;
                    }
                })
            );

            uploadedImages = uploadedImages.filter(Boolean);
        }

        console.log(req.body);


        const experience = await Experience.create({
            title,
            description,
            experienceType,
            location,
            pricePerPerson,
            duration,
            groupSize,
            schedule,
            ageRequirement,
            fitnessLevel,
            requirements,
            images: uploadedImages,
            inclusions,
            host: req.user._id
        });

        res.status(201).json({
            success: true,
            data: experience
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
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
            minRating
        } = req.query;

        const query = { status: 'active' };

        if (city) query['location.city'] = new RegExp(city, 'i');
        if (country) query['location.country'] = new RegExp(country, 'i');
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
            .populate('host', 'name email')
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
            data: experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
const getExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id)
            .populate('host', 'name email');

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            data: experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = async (req, res) => {
    try {
        let experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });

        if (experience.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this experience' });
        }

        const {
            title,
            description,
            experienceType,
            location,
            pricePerPerson,
            duration,
            groupSize,
            schedule,
            ageRequirement,
            fitnessLevel,
            images: newImages,
            requirements,
            inclusions,
            status
        } = req.body;

        const uploadedImages = newImages && newImages.length > 0
            ? await Promise.all(newImages.map(img => uploadOnCloudinary(img)))
            : experience.images;

        experience = await Experience.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                experienceType,
                location,
                pricePerPerson,
                duration,
                groupSize,
                schedule,
                ageRequirement,
                fitnessLevel,
                requirements,
                images: uploadedImages,
                inclusions,
                status
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: experience });

    } catch (error) {
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
                message: 'Experience not found'
            });
        }

        // Check ownership
        if (experience.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this experience'
            });
        }

        await experience.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get host's experiences
// @route   GET /api/experiences/host
// @access  Private
const getHostExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find({ host: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createExperience,
    getExperiences,
    getExperience,
    updateExperience,
    deleteExperience,
    getHostExperiences
};
