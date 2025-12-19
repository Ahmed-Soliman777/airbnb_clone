const User = require("../models/User.model.js");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const { uploadOnCloudinary } = require('../config/cloudinary.js');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, dob, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex');

    const user = new User({
      firstName,
      lastName,
      email,
      dob,
      password: password,
      verificationCode
    });

    await user.save();

    // ================================
    //   Brevo SMTP SETUP
    // ================================
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY
      }
    });

    const mailOptions = {
      from: process.env.BREVO_Email,
      to: email,
      subject: "Verify your account",
      text: `Hello ${firstName},

Welcome to our platform!

Your verification code is: ${verificationCode}

If you didn't create an account with us, you can ignore this message.

Best regards,
Airbnb Team `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'User registered successfully, check your email for verification code'
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log("EMAIL ERROR:", err);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: 'Invalid verification code' });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      message: 'Email verified successfully',
      token
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User is not found' });
    }

    if (!user.verificationCode) {
      return res.status(400).json({ message: 'No verification code found' });
    }

    // ================================
    //   SAME Brevo SMTP SETUP
    // ================================
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY
      }
    });

    const mailOptions = {
      from: process.env.BREVO_Email,
      to: email,
      subject: "Verify your account",
      text: `Hello ${user.firstName},

Welcome back!

Your verification code is: ${user.verificationCode}

If you didn't request this, you can ignore this email.

Best regards,
Airbnb Team `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Verification code resent successfully"
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log("RESEND EMAIL ERROR:", err);
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// add logout controller for user
exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully!" });
};

exports.becomeHost = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'guest') {
      return res.status(400).json({ message: 'Only guests can become hosts' });
    }

    user.role = 'host';
    await user.save();

    res.json({ message: 'User role updated to host successfully', role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//code for forget password
exports.sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(400).json({ message: "User is not verified" });

    const resetCode = crypto.randomBytes(3).toString("hex").toUpperCase(); 
    const expireTime = Date.now() + 30 * 60 * 1000; 

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpire = expireTime;
    await user.save();

    // ============================
    // Brevo email
    // ============================
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY
      }
    });

    const mailOptions = {
      from: process.env.BREVO_Email,
      to: email,
      subject: "Password Reset Code",
      text: `Hello ${user.firstName},

Your password reset code is: ${resetCode}

This code is valid for 10 minutes.

If you didn’t request a password reset, ignore this email.

Best regards,
Airbnb Team`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset code sent to your email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (
      user.resetPasswordCode !== code ||
      !user.resetPasswordExpire ||
      user.resetPasswordExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    res.json({ message: "Code verified, proceed to reset password" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.resetPasswordCode || !user.resetPasswordExpire) {
      return res.status(400).json({ message: "Reset process not started" });
    }

    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: "Reset code expired" });
    }

    user.password = newPassword;

    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// (admin فقط)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email) {
      if (email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
      }
    } else {
      user.email = user.email;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;

    if (password) {
      user.password = password;
    } else {
      user.password = user.password;
    }

    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// delete
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




const FIELDS_TO_RETURN = [
    'firstName',  'profilePhoto', 'jobTitle', 'school', 'travelCities', 'interests', 
    'preferredLanguages', 'aboutMe', 'role', 'reviews', 'location', 
].join(' '); 

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id; 
        const userProfile = await User.findById(userId)
            .select(FIELDS_TO_RETURN) 
            .populate('reviews', 'rating comment author');

        if (!userProfile) {
            return res.status(404).json({ message: "Profile data not found" });
        }

        return res.status(200).json(userProfile);

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Server error while fetching profile" });
    }
};


const EDITABLE_FIELDS = [
    'jobTitle', 'school', 'travelCities', 'interests', 
    'preferredLanguages', 'aboutMe','location',
];

exports.updateProfile = async (req, res) => {
    try {
        const updates = {};
        
        for (const key of EDITABLE_FIELDS) {
            if (req.body.hasOwnProperty(key)) {
                updates[key] = req.body[key];
            }
        }
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates }, 
            { new: true, runValidators: true }
        ).select(FIELDS_TO_RETURN);

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Failed to update profile.' });
    }
};

exports.uploadProfilePhoto = async (req, res) => {
    try {
        const { base64Image } = req.body; 
        
        if (!base64Image) {
            return res.status(400).json({ message: "Base64 image string is required." });
        }

        const imageUrl = await uploadOnCloudinary(base64Image);
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profilePhoto: imageUrl },
            { new: true }
        ).select('profilePhoto'); 

        res.status(200).json({ 
            profilePhoto: imageUrl, 
            message: "Profile photo updated successfully." 
        });

    } catch (error) {
        console.error("Error during Base64 upload process:", error);
        res.status(500).json({ message: "Server error during image upload." });
    }
};