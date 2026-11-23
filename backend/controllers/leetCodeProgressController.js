const LeetCodeProgress = require('../models/LeetCodeProgress');
const handleError = require('../middleware/handleError');
const toList = require('../utils/toList');

// Get all LeetCode progress entries
exports.getAllLeetCodeProgress = async (req, res) => {
  try {
    const problems = await LeetCodeProgress.find().sort({ dateSolved: -1 });
    res.json(problems);
  } catch (err) {
    handleError(err, res);
  }
};

// Get LeetCode progress by ID
exports.getLeetCodeProgressById = async (req, res) => {
  try {
    const problem = await LeetCodeProgress.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ msg: 'LeetCode problem not found' });
    }
    res.json(problem);
  } catch (err) {
    handleError(err, res);
  }
};

// Create a new LeetCode progress entry
exports.createLeetCodeProgress = async (req, res) => {
  try {
    const { title, difficulty, tags, status, solutionLink, dateSolved, notes } = req.body;
    
    const newProblem = new LeetCodeProgress({
      title,
      difficulty,
      tags: toList(tags),
      status,
      solutionLink,
      dateSolved,
      notes,
    });
    
    const problem = await newProblem.save();
    res.json(problem);
  } catch (err) {
    handleError(err, res);
  }
};

// Update a LeetCode progress entry
exports.updateLeetCodeProgress = async (req, res) => {
  try {
    const { title, difficulty, tags, status, solutionLink, dateSolved, notes } = req.body;
    
    let problem = await LeetCodeProgress.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ msg: 'LeetCode problem not found' });
    }
    
    const problemFields = {
      title,
      difficulty,
      tags: toList(tags),
      status,
      solutionLink,
      dateSolved,
      notes,
    };
    
    problem = await LeetCodeProgress.findByIdAndUpdate(
      req.params.id,
      { $set: problemFields },
      { new: true, runValidators: true }
    );
    
    res.json(problem);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete a LeetCode progress entry
exports.deleteLeetCodeProgress = async (req, res) => {
  try {
    const problem = await LeetCodeProgress.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ msg: 'LeetCode problem not found' });
    }
    
    await LeetCodeProgress.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'LeetCode problem removed' });
  } catch (err) {
    handleError(err, res);
  }
};

// Get LeetCode progress statistics
exports.getLeetCodeStats = async (req, res) => {
  try {
    const problems = await LeetCodeProgress.find();
    
    const stats = {
      total: problems.length,
      solved: problems.filter(p => p.status === 'Solved').length,
      inProgress: problems.filter(p => p.status === 'In Progress').length,
      attempted: problems.filter(p => p.status === 'Attempted').length,
      byDifficulty: {
        easy: problems.filter(p => p.difficulty === 'Easy').length,
        medium: problems.filter(p => p.difficulty === 'Medium').length,
        hard: problems.filter(p => p.difficulty === 'Hard').length,
      },
      byStatus: {
        solved: problems.filter(p => p.status === 'Solved').length,
        inProgress: problems.filter(p => p.status === 'In Progress').length,
        attempted: problems.filter(p => p.status === 'Attempted').length,
      },
    };
    
    res.json(stats);
  } catch (err) {
    handleError(err, res);
  }
};