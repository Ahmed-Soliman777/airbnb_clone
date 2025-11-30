const User = require("../models/User.model.js");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { firstName,lastName, email,dob, password } = req.body;

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
    console.log("EMAIL ERROR:",err);
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
      httpOnly: true,
      secure: "production",
      sameSite: "strict",
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
      httpOnly: true,
      secure: "production",
      sameSite: "strict",
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
    const userId = req.user && req.user.userId; 
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
