const User = require('../model/usermodel.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';



exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex'); 

    const user = new User({
      name,
      email,
      passwordHash: password,
      verificationCode
    });

    await user.save();

   // generate verificatioon email and send it
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your account',
      text: ` Hello ${name},

🎉 Welcome to our platform! We're so happy to have you on board.

Before you start exploring, please verify your email to activate your account.

Your verification code is: ${verificationCode}

If you didn't create an account with us, please ignore this message.

Best regards,
The Team 💌`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered successfully, check your email for verification code' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: 'Invalid verification code' });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
    const { name, email, phone, password } = req.body;

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

    user.name = name || user.name;
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
