const express = require('express');
const router = express.Router();
const { getAllDemos, createDemo, updateDemo, deleteDemo } = require('../controllers/demoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllDemos);
router.post('/', auth, upload.single('icon'), createDemo);
router.put('/:id', auth, upload.single('icon'), updateDemo);
router.delete('/:id', auth, deleteDemo);

module.exports = router;
