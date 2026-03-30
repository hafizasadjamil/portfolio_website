const Demo = require('../models/Demo');

// Get all demos
exports.getAllDemos = async (req, res) => {
  try {
    const demos = await Demo.find().populate('project', 'title').sort({ createdAt: -1 });
    res.json(demos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      icon: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const demo = await newDemo.save();
    res.json(demo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };

    if (req.file) {
      demoFields.icon = `/uploads/${req.file.filename}`;
    }

    demo = await Demo.findByIdAndUpdate(
      req.params.id,
      { $set: demoFields },
      { new: true }
    );

    res.json(demo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
