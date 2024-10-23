const db = require('../db');

// Get all courses
exports.getAllCourses = (req, res) => {
  const sql = 'SELECT * FROM courses';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }
    res.json(results);
  });
};

// Get a single course by ID
exports.getCourseById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM courses WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch course' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(result[0]);
  });
};
