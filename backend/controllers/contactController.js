const nodemailer = require('nodemailer');
const validator = require('validator');
const Message = require('../models/Message');
const handleError = require('../middleware/handleError');

const MAX_LENGTH = { name: 100, email: 200, subject: 200, message: 5000 };

const sendNotification = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Gmail only sends as the account owner, so the visitor goes in replyTo.
  await transporter.sendMail({
    from: { name: 'Portfolio Contact', address: process.env.EMAIL_USER },
    replyTo: { name, address: email },
    to: process.env.EMAIL_USER,
    subject: `Portfolio Contact: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });
};

// Send a contact message
exports.sendMessage = async (req, res) => {
  const fields = {};
  for (const key of Object.keys(MAX_LENGTH)) {
    const value = req.body[key];
    if (typeof value !== 'string' || !value.trim()) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (value.length > MAX_LENGTH[key]) {
      return res.status(400).json({ msg: `Your ${key} is too long (max ${MAX_LENGTH[key]} characters)` });
    }
    fields[key] = key === 'message' ? value.trim() : value.replace(/[\r\n]+/g, ' ').trim();
  }

  if (!validator.isEmail(fields.email)) {
    return res.status(400).json({ msg: 'Please enter a valid email' });
  }

  try {
    await new Message(fields).save();

    // The message is already saved, so a slow or failing mail server must not hold up the reply.
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      sendNotification(fields).catch(err => {
        console.error('Email notification failed, but message saved to DB:', err.message);
      });
    }

    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    handleError(err, res);
  }
};

// Get all contact messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    handleError(err, res);
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
      { new: true, runValidators: true }
    );

    res.json(message);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Message removed' });
  } catch (err) {
    handleError(err, res);
  }
};