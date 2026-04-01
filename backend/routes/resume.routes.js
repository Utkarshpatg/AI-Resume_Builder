const express = require('express');
const router = express.Router();
const {
  getResumes,
  getResumeById,
  createResume,
} = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All resume routes are protected

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResumeById);

module.exports = router;
