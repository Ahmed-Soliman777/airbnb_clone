const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
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
    experienceType: {
        type: String,
        required: [true, 'Experience type is required'],
        trim: true
    },
    location: {
        street: {
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
    pricePerPerson: {
        type: Number,
        required: [true, 'Price per person is required'],
        min: [0, 'Price cannot be negative']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
        trim: true
    },
    groupSize: {
        min: {
            type: Number,
            default: 1,
            min: [1, 'Minimum group size must be at least 1']
        },
        max: {
            type: Number,
            default: 10,
            min: [1, 'Maximum group size must be at least 1']
        }
    },
    schedule: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    ageRequirement: {
        type: String,
        trim: true
    },
    fitnessLevel: {
        type: String,
        trim: true
    },
    requirements: [String],
    images: [{
        url: String,
        alt: String
    }],
    inclusions: [String],
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
experienceSchema.index({ title: 'text', description: 'text' });
experienceSchema.index({ 'location.city': 1, 'location.country': 1 });
experienceSchema.index({ experienceType: 1 });
experienceSchema.index({ host: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
