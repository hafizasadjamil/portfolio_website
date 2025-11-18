const mongoose = require('mongoose');

// Define Profile schema
const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  cvUrl: {
    type: String,
    default: '',
  },
  socialLinks: {
    linkedin: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', ProfileSchema);

// Get profile data
exports.getProfile = async (req, res) => {
  try {
    // There should be only one profile document
    let profile = await Profile.findOne();
    
    // If no profile exists, create a default one
    if (!profile) {
      profile = new Profile({
        name: 'Muhammad Asad Jamil',
        tagline: 'AI & Software Engineer | Building Intelligent and Scalable Systems',
        bio: 'I am a Computer Science graduate passionate about Artificial Intelligence and intelligent systems. I specialize in Python, machine learning frameworks, and full-stack development. I love solving real-world problems with code, from building AI-powered applications to deploying production-ready systems.',
      });
      
      await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update profile data
exports.updateProfile = async (req, res) => {
  try {
    const { name, tagline, bio, cvUrl, socialLinks } = req.body;
    
    let profile = await Profile.findOne();
    
    // If no profile exists, create one
    if (!profile) {
      profile = new Profile({
        name,
        tagline,
        bio,
        cvUrl,
        socialLinks: JSON.parse(socialLinks),
      });
    } else {
      const profileFields = {
        name,
        tagline,
        bio,
        cvUrl,
        socialLinks: JSON.parse(socialLinks),
        updatedAt: Date.now()
      };
      
      if (req.file) {
        profileFields.profileImage = `/uploads/${req.file.filename}`;
      }
      
      profile = await Profile.findOneAndUpdate(
        {},
        { $set: profileFields },
        { new: true, upsert: true }
      );
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};