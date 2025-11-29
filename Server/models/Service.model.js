const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    serviceCategory: {
        type: String,
        required: [true, 'Service category is required'],
        trim: true
    },
    location: {
        serviceArea: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true
        },
        coordinates: {
            lat: {
                type: Number,
                default: 0
            },
            lng: {
                type: Number,
                default: 0
            }
        }
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: [0, 'Hourly rate cannot be negative']
    },
    packages: [{
        name: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            min: [0, 'Price cannot be negative']
        },
        duration: String
    }],
    availability: [{
        day: String,
        startTime: String,
        endTime: String,
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    requirements: [{
        type: String,
        trim: true
    }],
    skills: [{
        type: String,
        trim: true
    }],
    images: [{
        url: String,
        alt: String
    }],
    serviceDetails: {
        responseTime: {
            type: String,
            trim: true
        },
        cancellationPolicy: {
            type: String,
            trim: true
        },
        additionalInfo: {
            type: String,
            trim: true,
            maxlength: [2000, 'Additional info cannot exceed 2000 characters']
        }
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Host is required']
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for search optimization
serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ 'location.city': 1, 'location.country': 1 });
serviceSchema.index({ serviceCategory: 1 });
serviceSchema.index({ host: 1 });

module.exports = mongoose.model('Service', serviceSchema);
