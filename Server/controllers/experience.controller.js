const Experience = require('../models/Experience.model');

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
            images,
            inclusions
        } = req.body;

        const experience = await Experience.create({
            title,
            description,
            experienceType,
            location: {
                street,
                city,
                country,
                coordinates
            },
            pricePerPerson,
            duration,
            groupSize,
            schedule,
            ageRequirement,
            fitnessLevel,
            requirements,
            images,
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
        const { city, country, experienceType, page = 1, limit = 10 } = req.query;

        const query = { status: 'active' };

        if (city) query['location.city'] = new RegExp(city, 'i');
        if (country) query['location.country'] = new RegExp(country, 'i');
        if (experienceType) query.experienceType = experienceType;

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
                message: 'Not authorized to update this experience'
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
            images,
            inclusions,
            status
        } = req.body;

        experience = await Experience.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                experienceType,
                location: {
                    street,
                    city,
                    country,
                    coordinates
                },
                pricePerPerson,
                duration,
                groupSize,
                schedule,
                ageRequirement,
                fitnessLevel,
                requirements,
                images,
                inclusions,
                status
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
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
