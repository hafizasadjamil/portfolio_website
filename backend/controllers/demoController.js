const Demo = require('../models/Demo');
const handleError = require('../middleware/handleError');
const toList = require('../utils/toList');

// Get all demos
exports.getAllDemos = async (req, res) => {
  try {
    const demos = await Demo.find().populate('project', 'title').sort({ createdAt: -1 });
    res.json(demos);
  } catch (err) {
    handleError(err, res);
  }
};

// Create a demo
exports.createDemo = async (req, res) => {
  try {
    const { title, description, type, src, project, tags } = req.body;

    const newDemo = new Demo({
      title,
      description,
      type,
      src,
      project: project || null,
      tags: toList(tags),
      icon: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const demo = await newDemo.save();
    res.json(demo);
  } catch (err) {
    handleError(err, res);
  }
};

// Update a demo
exports.updateDemo = async (req, res) => {
  try {
    const { title, description, type, src, project, tags } = req.body;

    let demo = await Demo.findById(req.params.id);
    if (!demo) return res.status(404).json({ msg: 'Demo not found' });

    const demoFields = {
      title,
      description,
      type,
      src,
      project: project || null,
      tags: toList(tags)
    };

    if (req.file) {
      demoFields.icon = `/uploads/${req.file.filename}`;
    }

    demo = await Demo.findByIdAndUpdate(
      req.params.id,
      { $set: demoFields },
      { new: true, runValidators: true }
    );

    res.json(demo);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete a demo
exports.deleteDemo = async (req, res) => {
  try {
    const demo = await Demo.findById(req.params.id);
    if (!demo) return res.status(404).json({ msg: 'Demo not found' });

    await Demo.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Demo removed' });
  } catch (err) {
    handleError(err, res);
  }
};
