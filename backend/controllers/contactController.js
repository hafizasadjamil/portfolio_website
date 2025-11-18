const nodemailer = require('nodemailer');
const validator = require('validator');
const Message = require('../models/Message');

// Send a contact message
exports.sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: 'Please enter a valid email' });
  }

  try {
    // Save message to database
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all contact messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Mark a message as read
exports.markMessageAsRead = async (req, res) => {
  try {
    let message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    message = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true } },
      { new: true }
    );
    
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    await message.remove();
    
    res.json({ msg: 'Message removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};