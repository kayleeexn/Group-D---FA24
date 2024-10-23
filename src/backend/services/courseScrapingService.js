const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require("pretty");
const sqlite3 = require('sqlite3').verbose();

// Database connection
const db = new sqlite3.Database('../databases/courses_database.db', (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log('Connected to the courses database.');
    }
});


// Function to insert course data into the database
function insertCourse(courseCode, courseTitle, credits, courseDescription) {
    const sql = `INSERT INTO Courses (course_code, course_title, credits, course_description) VALUES (?, ?, ?, ?)`;
    db.run(sql, [courseCode, courseTitle, credits, courseDescription], (err) => {
        if (err) {
            console.error("Error inserting data:", err.message);
        } else {
            console.log(`Inserted: ${courseCode} - ${courseTitle}`);
        }
    });
}

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS Courses`);
    db.run(`CREATE TABLE IF NOT EXISTS Courses (
        courseID TEXT PRIMARY KEY,
        courseName TEXT,
        courseCreditHours TEXT,
        courseDescription TEXT
        )`);
      
});

// Function to scrape a course page
const scrapeCoursePage = async(url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Find all course blocks
        const courseBlocks = $('div.courseblock'); // Using the course block selector

        courseBlocks.each((index, element) => {
            const courseBlock = $(element);
            const courseBlockCode = courseBlock.find('span.courseblockcode').text().trim();
            const courseTitle = courseBlock.find('p.courseblocktitle.noindent').text().trim();
            const credits = courseBlock.find('span.credits').text().trim();
            const courseDescription = courseBlock.find('p.courseblockdesc').text().trim();

            // Log extracted data
            console.log(`Course Code: ${courseBlockCode}, Course Title: ${courseTitle}, Credits: ${credits}, Course Description: ${courseDescription}`);
            
            // Check if the department already exists
            db.get('SELECT * FROM Courses WHERE name = ?', [courseBlockCode], function (err, row) {
                if (err) {
                    console.error("Error checking for existing data: ", err.message);
                } else if (!row) {
                    // Insert into the database if not already there
                    db.run('INSERT INTO Courses (courseID, courseName, courseCreditHours, courseDescription) VALUES (?, ?, ?)', [courseBlockCode, courseTitle, credits,], function (err) {
                        if (err) {
                            console.error("Error inserting data: ", err.message);
                        } else {
   //                         console.log(`Inserted: ${departmentID} - ${courseDepartment}`);
                        }
                    });
                } else {
    //                console.log(`Record already exists: ${departmentID} - ${courseDepartment}`);
                }
            });
        });
    } catch (error) {
        console.error("Error scraping course page:", error.message);
    }
}

// Function to scrape the main course page to get links to course pages
const scrapeMainPage = async (mainUrl) => {
    try {
        const response = await axios.get(mainUrl);
        const $ = cheerio.load(response.data);

        // Get all course links from the main page
        const courseLinks = [];
        $('a[href^="/courses/"]').each((i, elem) => {
            const link = $(elem).attr('href');
            if (link) {
                // Make sure the link is absolute
                const fullLink = `https://ou-public.courseleaf.com${link}`;
                courseLinks.push(fullLink);
            }
        });

        // Loop through course links and scrape each one
        for (const courseLink of courseLinks) {
            await scrapeCoursePage(courseLink);
        }
    } catch (error) {
        console.error(`Error fetching main page:`, error.message);
    }
};

// Start the scraping process
const mainCoursePageUrl = 'https://ou-public.courseleaf.com/courses/';
scrapeMainPage(mainCoursePageUrl).then(() => {
    console.log('Scraping completed.');
    db.close(); // Close the database connection after scraping
});


