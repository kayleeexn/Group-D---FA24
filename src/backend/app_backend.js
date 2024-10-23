const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./databases/courses.db', (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log('Connected to the majors database.');
    }
});

// Route to fetch all departments
app.get('/departments', (req, res) => {
    const sql = 'SELECT * FROM Departments';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({"data": rows});
    });
});

// Route to fetch all courses
app.get('/courses', (req, res) => {
    const sql = 'SELECT * FROM Courses';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({"data": rows});
    });
});

// Route to fetch all majors
app.get('/majors', (req, res) => {
    const sql = 'SELECT * FROM Majors';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({"data": rows});
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});