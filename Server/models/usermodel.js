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

  role: { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' },

  passwordHash: { type: String ,required: true}, 
  salt: { type: String }, 

  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
}, {
  timestamps: true
});

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
