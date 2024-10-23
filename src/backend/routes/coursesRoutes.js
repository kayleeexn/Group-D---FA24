const express = require('express');
const router = express.Router();
const courseController = require('../controllers/coursesController');

// Define the API routes for courses
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

module.exports = router;
