const Profile = require('../models/Profile');
const handleError = require('../middleware/handleError');

// Get profile data. There is only ever one profile document.
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || new Profile());
  } catch (err) {
    handleError(err, res);
  }
};

// Update profile data
exports.updateProfile = async (req, res) => {
  try {
    const { name, tagline, bio, cvUrl, bookingUrl, securityWork } = req.body;
    const fields = { name, tagline, bio, cvUrl, bookingUrl, securityWork, updatedAt: Date.now() };

    if (req.body.socialLinks) {
      try {
        fields.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (err) {
        return res.status(400).json({ msg: 'socialLinks must be valid JSON' });
      }
    }

    if (req.file) {
      fields.profileImage = `/uploads/${req.file.filename}`;
    }

    // Leave out anything the request didn't send, so it keeps its current value.
    const changes = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));

    const profile = (await Profile.findOne()) || new Profile();
    profile.set(changes);
    await profile.save();

    res.json(profile);
  } catch (err) {
    handleError(err, res);
  }
};
