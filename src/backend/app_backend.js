/* Backend logic with MySQL connection */

// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./databases/courses_database.db', (err) => {
    if (err) {
        console.error("Error opening database: ", err.message);
    } else {
        console.log('Connected to the courses database.');
    }
});

// Create the Courses table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        credits TEXT NOT NULL,
        description TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error("Error creating Courses table: ", err.message);
        } else {
            console.log('Courses table ready.');
        }
    });
});

// Route to add a course
app.post('/api/courses', (req, res) => {
    const { code, title, credits, description } = req.body;

    if (!code || !title || !credits || !description) {
        return res.status(400).json({ error: 'All fields (code, title, credits, description) are required' });
    }

    // Insert the new course into the database
    const sql = `INSERT INTO Courses (code, title, credits, description) VALUES (?, ?, ?, ?)`;
    db.run(sql, [code, title, credits, description], function(err) {
        if (err) {
            console.error("Error inserting data: ", err.message);
            return res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ success: "Course added successfully", id: this.lastID });
        }
    });
});

// Route to fetch all courses
app.get('/api/courses', (req, res) => {
    const sql = `SELECT * FROM Courses`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error fetching data: ", err.message);
            return res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ courses: rows });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
