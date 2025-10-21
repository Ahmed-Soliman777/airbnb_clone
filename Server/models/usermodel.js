const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: { 
  type: String, 
  trim: true, 
  required: true,
  minlength: [3, 'Name must be at least 3 characters long']
}
,

  email: { 
  type: String, 
  required: true,
  unique: true, 
  sparse: true, 
  trim: true, 
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
}
,
 phone: { 
  type: String, 
  unique: true, 
  sparse: true, 
  trim: true,
  match: [/^(010|011|012|015)[0-9]{8}$/, 'Please enter a valid Egyptian phone number']
},
verificationCode: { type: String },
isVerified: { type: Boolean, default: false },
  birthDate: {
    type: String,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Please enter birth date in YYYY-MM-DD format']
  },
    passportId: {
    type: String,
    trim: true,
    match: [/^[A-Za-z0-9\-]{5,20}$/, 'Please enter a valid passport ID (5-20 alphanumeric characters)'],
    sparse: true,
    unique: true
  },

  role: { type: String, enum: ['guest', 'host', 'admin', "main-host"], default: 'guest' },

  passwordHash: { type: String ,required: true}, 
  salt: { type: String }, 

  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
   reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
  
}, {
  timestamps: true
});

userSchema.path('reviews').validate(function (v) {
  if (Array.isArray(v) && v.length > 0) {
    return this.role === 'host';
  }
  return true;
}, 'Only users with role "host".');


userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('passwordHash') || !this.passwordHash) return next();

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.salt = salt;
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);

    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
