/*
    We use axios and cheerios to webscrape data from the ou course catalog.
    Our approach for this was to copy and paste the inspect page for the A-Z
    list of department courses, then we fetch data using cheerios and axios again
    to get further information upon each course. 
    
    We webscrape the data, store it in a dataframe for us to use! 

    pretty just makes the html prettier, to output, for testing purposes..

    we want to take the data and store it into a SQL database so that we can develop an API

    resource on learning about webscraping using the following libraries: 
    https://serpapi.com/blog/web-scraping-in-javascript-complete-tutorial-for-beginner/#step-by-step-tutorial-on-web-scraping-in-javascript-or-nodejs-with-cheerio
*/


const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");
const sqlite3 = require("sqlite3").verbose();


// set up database named courses.db
const db = new sqlite3.Database('../databases/courses.db', (err) => 
    {
    if (err)
        {
            console.error("Database connection error:", err.message);

        }
        else
        {
        console.log('Connected to the courses database.');
        }
});

// create tables inside the database if they don't exist, departments and courses tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Departments (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        link TEXT NOT NULL,
        UNIQUE(name)
    )`);
      
db.run(`DROP TABLE IF EXISTS Courses`);
db.run(`CREATE TABLE IF NOT EXISTS Courses (
        courseID TEXT PRIMARY KEY,
        courseName TEXT,
        courseCreditHours TEXT,
        courseDescription TEXT
    )`);


// Create the majors table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS Majors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    majorName TEXT,
    majorDegree TEXT,
    link TEXT
)`);


});

/* 
    courses from https://ou-public.courseleaf.com/courses/ course catalog,
    copied and pasted the inspect page to extract 
    1) List of Department Courses A-Z
    and 
    2) The links to the department course lists, which include those course
    names, course credit hours, and course description.

    the htmlcourses is that course catalog that we are scraping!
*/

const scrapeDepartments = async (htmlcourses) => {
    // cheerio scrapes what we had given it and places it into $ so we  can later parse 
    const $ = cheerio.load(htmlcourses);

    $('h2').each(function () {
        const departmentID = $(this).text().trim();
        
        // Loop through each course in the department
        $(this).next('ul').find('li').each(function () {
            // Get the href link
            const link = $(this).find('a').attr('href');

            // Get the course details
            const courseDetails = $(this).find('a').text().trim();

            // Split to get the course name
            const courseDepartment = courseDetails.split('-')[1]?.trim();

            // Ensure courseDepartment exists before proceeding
            if (!courseDepartment) {
                console.log(`Invalid course details: ${courseDetails}`);
                return; 
            }

            // Check if the department already exists
            db.get('SELECT * FROM Departments WHERE name = ?', [courseDepartment], function (err, row) {
                if (err) {
                    console.error("Error checking for existing data: ", err.message);
                } else if (!row) {
                    // Insert into the database if not already there
                    db.run('INSERT INTO Departments (id, name, link) VALUES (?, ?, ?)', [departmentID, courseDepartment, link], function (err) {
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
    });
};

/*  Getting those departments from the database so that we can insert it and
    access the links later on  */
const getDepartments = () =>
    {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Departments", [], (err, rows) => {
                if (err) {
                    reject(err);  // Reject the promise if there's an error
                } else {
                    console.log("Departments in database:", rows);
                    resolve(rows);  // Resolve with the department rows
                }
            });
        });

    };

// each link only has /courses/theircourse so we need to have a base to add on, which would be this one
const BASE_URL = `https://ou-public.courseleaf.com`


// this gets all of the departments, accesses the links and scrapes each course info so that we can insert them into the database
async function scrapeCourses(departments) {
    try {
        for (const department of departments) 
            {

            // Access the link property from department
            const departmentLink = department.link;  

            // Complete URL for scraping
            const departmentUrl = `${BASE_URL}${departmentLink}`;  

            // Debug log
           console.log("Scraping department URL:", departmentUrl);  

            // Fetching the page and loading the HTML into Cheerio
            const response = await axios.get(departmentUrl);  
            const $ = cheerio.load(response.data); 

            // this loop goes into those urls and parses each courseblock which thankfully holds everything we need!!!
            $('.courseblock').each((i, el) => {
                
                // Extracting the full course title (ID, Name, Credits)
                const courseTitleText = $(el).find('.courseblocktitle').text().trim();
                const [courseID = 'ID not available', courseName = 'Name not available'] = courseTitleText
                .split('.').map(item => item.trim());


                let courseCreditHours = $(el).find('.credits strong').text().trim();

                // If credit hours are not found, provide a default message
                if (!courseCreditHours) {
                 courseCreditHours = 'Credit hours not available';
                }
                
                // Extracting courseDescription from courseblockdesc
                const courseDescription = $(el).find('.courseblockdesc').text().trim() || 'Description not available';
        
                // Log to verify the data before inserting
   /*           console.log("Inserting course:", {
                    courseID, 
                    courseName, 
                    courseCreditHours, 
                    courseDescription
               });
*/ 
                // Insert course into the Courses table
                db.run(
                    'INSERT INTO Courses (courseID, courseName, courseCreditHours, courseDescription) VALUES (?, ?, ?, ?)',
                    [courseID, courseName, courseCreditHours, courseDescription],
                    function(err) {
                        if (err) {
                            console.error("Error inserting course:", err.message);
                        } else {
                            console.log(`Inserted course: ${courseID} - ${courseName}`);
                        }
                    }
                );
            });
        }
    } catch (error) {
        console.error("Error scraping courses:", error.message);
    }
}


async function scrapeMajors() {
    const url = 'https://ou-public.courseleaf.com/academic-majors/';
    
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        // Traverse all <h2> headers on the page
        $('h2').each((i, header) => {
            const majorSection = $(header).next('ul'); // Get the <ul> following the <h2> header

            if (majorSection.length) {
                majorSection.find('li').each((j, item) => {
                    const anchor = $(item).find('a');
                    if (anchor.length) {
                        const majorLink = anchor.attr('href'); // Extract the link
                        const majorFullName = anchor.text().trim(); // Extract and trim the full name
                        
                        // Split the full name into name and degree
                        const [majorName, majorDegree] = majorFullName.split(', ');
                        
                        // Prepare to insert the major information into the database
                        db.get('SELECT * FROM Majors WHERE majorName = ? AND majorDegree = ?', [majorName.trim(), majorDegree ? majorDegree.trim() : ''], (err, row) => {
                            if (err) {
                                console.error("Error checking for existing major: ", err.message);
                            } else if (!row) {
                                // Insert the new major into the database
                                db.run('INSERT INTO Majors (majorName, majorDegree, link) VALUES (?, ?, ?)', 
                                    [majorName.trim(), majorDegree ? majorDegree.trim() : '', majorLink], 
                                    function (err) {
                                        if (err) {
                                            console.error("Error inserting major: ", err.message);
                                        } else {
                                            console.log(`Inserted Major: ${majorName.trim()} - Degree: ${majorDegree ? majorDegree.trim() : 'N/A'} - Link: ${majorLink}`);
                                        }
                                    }
                                );
                            } else {
                                console.log(`Major already exists: ${majorName.trim()} - Degree: ${majorDegree ? majorDegree.trim() : 'N/A'}`);
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error fetching majors:', error);
    }
}







// Main function to run the whole process
const main = async () => {
    try
    { 

        // sorry this is so long, this is the url to the departments page we are scraping, for some reason i had TOO much trouble
        // scraping the url itself so i opted out and just copied and pasted, but we may have to redo that process if information updates

    const htmlcourses = `
<h2 id="a822428" class="letternav-head">A</h2>
<ul><li><a href="/courses/a_hi/">A HI-Art History</a></li><li><a href="/courses/a_t/">A T-Art and Technology</a></li><li><a href="/courses/acct/">ACCT-Accounting</a></li><li><a href="/courses/aero/">AERO-Aerospace Studies</a></li><li><a href="/courses/afam/">AFAM-African &amp; African American Studies</a></li><li><a href="/courses/agsc/">AGSC-Atmospheric and Geographic Sciences </a></li><li><a href="/courses/ahs/">AHS-Allied Health Sciences</a></li><li><a href="/courses/ame/">AME-Aerospace &amp; Mechanical Engineering</a></li><li><a href="/courses/amgt/">AMGT-Arts Management</a></li><li><a href="/courses/anth/">ANTH-Anthropology</a></li><li><a href="/courses/arab/">ARAB-Arabic</a></li><li><a href="/courses/arch/">ARCH-Architecture</a></li><li><a href="/courses/arnm/">ARNM-Art for Non-Majors</a></li><li><a href="/courses/art/">ART-Art</a></li><li><a href="/courses/artc/">ARTC-Art Theory &amp; Criticism</a></li><li><a href="/courses/arth/">ARTH-Art Therapy</a></li><li><a href="/courses/astr/">ASTR-Astronomy</a></li><li><a href="/courses/atc/">ATC-Art, Technology, and Culture</a></li><li><a href="/courses/avia/">AVIA-Aviation</a></li>
</ul><h2 id="b822428" class="letternav-head">B</h2>
<ul><li><a href="/courses/b_ad/">B AD-Business Administration</a></li><li><a href="/courses/b_c/">B C-Business  Communication</a></li><li><a href="/courses/basn/">BASN-Bassoon</a></li><li><a href="/courses/bass/">BASS-Bass</a></li><li><a href="/courses/bia/">BIA-Business Intelligence &amp; Analysis</a></li><li><a href="/courses/biol/">BIOL-Biology</a></li><li><a href="/courses/bme/">BME-Biomedical Engineering</a></li>
</ul><h2 id="c822428" class="letternav-head">C</h2>
<ul><li><a href="/courses/c_s/">C S-Computer Science</a></li><li><a href="/courses/cas/">CAS-College of Arts &amp; Sciences</a></li><li><a href="/courses/cee/">CEE-College of Earth &amp; Energy</a></li><li><a href="/courses/cees/">CEES-Civil Engineering &amp; Environmental Science</a></li><li><a href="/courses/celo/">CELO-Cello</a></li><li><a href="/courses/ch_e/">CH E-Chemical Engineering</a></li><li><a href="/courses/chem/">CHEM-Chemistry</a></li><li><a href="/courses/cher/">CHER-Cherokee</a></li><li><a href="/courses/chin/">CHIN-Chinese</a></li><li><a href="/courses/choc/">CHOC-Choctaw</a></li><li><a href="/courses/cl_c/">CL C-Classical Culture</a></li><li><a href="/courses/clar/">CLAR-Clarinet</a></li><li><a href="/courses/cns/">CNS-Construction Science</a></li><li><a href="/courses/comm/">COMM-Communication</a></li><li><a href="/courses/comp/">COMP-Composition</a></li><li><a href="/courses/crek/">CREK-Creek</a></li><li><a href="/courses/crju/">CRJU-Criminal Justice</a></li><li><a href="/courses/cybs/">CYBS-Cybersecurity</a></li>
</ul><h2 id="d822428" class="letternav-head">D</h2>
<ul><li><a href="/courses/danc/">DANC-Dance</a></li><li><a href="/courses/deng/">DENG-Developmental English</a></li><li><a href="/courses/des/">DES-Design</a></li><li><a href="/courses/dmat/">DMAT-Developmental Mathematics</a></li><li><a href="/courses/dram/">DRAM-Drama</a></li><li><a href="/courses/drdg/">DRDG-Developmental Reading</a></li><li><a href="/courses/dsa/">DSA-Data Science and Analytics</a></li>
</ul><h2 id="e822428" class="letternav-head">E</h2>
<ul><li><a href="/courses/eacs/">EACS-Educational Administration Curriculum &amp; Supervision</a></li><li><a href="/courses/ece/">ECE-Electrical &amp; Computer Engineering</a></li><li><a href="/courses/econ/">ECON-Economics</a></li><li><a href="/courses/edah/">EDAH-Adult and Higher Education</a></li><li><a href="/courses/edec/">EDEC-Early Childhood Education</a></li><li><a href="/courses/edel/">EDEL-Elementary Education</a></li><li><a href="/courses/eden/">EDEN-English Education</a></li><li><a href="/courses/edlt/">EDLT-Literacy Education</a></li><li><a href="/courses/edma/">EDMA-Mathematics Education</a></li><li><a href="/courses/edpc/">EDPC-Professional Counseling</a></li><li><a href="/courses/edpy/">EDPY-Education &amp; Counseling Psychology </a></li><li><a href="/courses/edrg/">EDRG-Reading Education</a></li><li><a href="/courses/eds/">EDS-Educational Studies</a></li><li><a href="/courses/edsc/">EDSC-Science Education</a></li><li><a href="/courses/edse/">EDSE-Secondary Education</a></li><li><a href="/courses/edsp/">EDSP-Special Education</a></li><li><a href="/courses/edss/">EDSS-Social Studies Education</a></li><li><a href="/courses/edsw/">EDSW-Education Sooner Works</a></li><li><a href="/courses/educ/">EDUC-College of Education </a></li><li><a href="/courses/edwl/">EDWL-World Language Education</a></li><li><a href="/courses/eipt/">EIPT-Instructional Psychology &amp; Technology</a></li><li><a href="/courses/elm/">ELM-Engineering Leadership and Management</a></li><li><a href="/courses/emad/">EMAD-Executive MBA Aerospace &amp; Defense</a></li><li><a href="/courses/emba/">EMBA-Executive Energy MBA</a></li><li><a href="/courses/emgt/">EMGT-Energy Management</a></li><li><a href="/courses/en_d/">EN D-Environmental Design</a></li><li><a href="/courses/engb/">ENGB-Energy for Business</a></li><li><a href="/courses/engl/">ENGL-English</a></li><li><a href="/courses/engr/">ENGR-College of Engineering</a></li><li><a href="/courses/enst/">ENST- Environmental Studies</a></li><li><a href="/courses/ent/">ENT-Entrepreneurship</a></li><li><a href="/courses/ephy/">EPHY-Engineering Physics</a></li><li><a href="/courses/euph/">EUPH-Euphonium</a></li><li><a href="/courses/expo/">EXPO-Expository Writing </a></li>
</ul><h2 id="f822428" class="letternav-head">F</h2>
<ul><li><a href="/courses/f_a/">F A-College of Fine Arts</a></li><li><a href="/courses/fin/">FIN-Finance</a></li><li><a href="/courses/flut/">FLUT-Flute</a></li><li><a href="/courses/fms/">FMS-Film and Media Studies</a></li><li><a href="/courses/fr_h/">FR H-French Horn</a></li><li><a href="/courses/fr/">FR-French</a></li>
</ul><h2 id="g822428" class="letternav-head">G</h2>
<ul><li><a href="/courses/g_e/">G E-Geological Engineering</a></li><li><a href="/courses/gcre/">GCRE-Grad Comp Recital</a></li><li><a href="/courses/gdma/">GDMA-Graduate Recital DMA</a></li><li><a href="/courses/geog/">GEOG-Geography</a></li><li><a href="/courses/geol/">GEOL-Geology</a></li><li><a href="/courses/germ/">GERM-German</a></li><li><a href="/courses/gis/">GIS-Geographic Information Science</a></li><li><a href="/courses/gphy/">GPHY-Geophysics</a></li><li><a href="/courses/grad/">GRAD-Graduate College</a></li><li><a href="/courses/grk/">GRK-Greek</a></li><li><a href="/courses/grre/">GRRE-Graduate Recital - MM </a></li><li><a href="/courses/gtar/">GTAR-Guitar </a></li>
</ul><h2 id="h822428" class="letternav-head">H</h2>
<ul><li><a href="/courses/h_r/">H R-Human Relations</a></li><li><a href="/courses/harp/">HARP-Harp</a></li><li><a href="/courses/hcb/">HCB-Health Care Business</a></li><li><a href="/courses/hebr/">HEBR-Hebrew</a></li><li><a href="/courses/hes/">HES-Health and Exercise Science</a></li><li><a href="/courses/hist/">HIST-History</a></li><li><a href="/courses/hms/">HMS-Health, Medicine, and Society</a></li><li><a href="/courses/hon/">HON-Honors College</a></li><li><a href="/courses/hpcd/">HPCD-Harpsichord</a></li><li><a href="/courses/hstm/">HSTM-History of Science, Technology, and Medicine</a></li>
</ul><h2 id="i822428" class="letternav-head">I</h2>
<ul><li><a href="/courses/i_d/">I D-Interior Design</a></li><li><a href="/courses/ias/">IAS-International &amp; Area Studies</a></li><li><a href="/courses/ilac/">ILAC-Instructional Leadership &amp; Academic Curriculum</a></li><li><a href="/courses/ilaw/">ILAW-International Law</a></li><li><a href="/courses/intl/">INTL-International Courses</a></li><li><a href="/courses/ise/">ISE-Industrial and Systems Engineering</a></li><li><a href="/courses/ital/">ITAL-Italian</a></li>
</ul><h2 id="j822428" class="letternav-head">J</h2>
<ul><li><a href="/courses/japn/">JAPN-Japanese</a></li><li><a href="/courses/jmc/">JMC-Journalism &amp; Mass Communication</a></li><li><a href="/courses/jrre/">JRRE-Music Recitals </a></li>
</ul><h2 id="k822428" class="letternav-head">K</h2>
<ul><li><a href="/courses/kiow/">KIOW-Kiowa</a></li>
</ul><h2 id="l822428" class="letternav-head">L</h2>
<ul><li><a href="/courses/l_a/">L A-Landscape Architecture</a></li><li><a href="/courses/l_s/">L S-Legal Studies</a></li><li><a href="/courses/lat/">LAT-Latin</a></li><li><a href="/courses/law/">LAW-Law</a></li><li><a href="/courses/ldma/">LDMA-Music Recitals</a></li><li><a href="/courses/lgbt/">LGBT-LGBTQ Studies</a></li><li><a href="/courses/ling/">LING-Linguistics</a></li><li><a href="/courses/lis/">LIS-Library and Information Studies</a></li><li><a href="/courses/lsg/">LSG-Legal Studies (General)</a></li><li><a href="/courses/lsh/">LSH-Legal Studies Healthcare Law</a></li><li><a href="/courses/lsha/">LSHA-Human &amp; Health Services Administration</a></li><li><a href="/courses/lsi/">LSI-Legal Studies Indigenous Peoples Law</a></li><li><a href="/courses/lsib/">LSIB-Legal Studies International Business Law</a></li><li><a href="/courses/lso/">LSO-Legal Studies Oil, Gas, &amp; Energy Law</a></li><li><a href="/courses/ltrs/">LTRS-Letters</a></li>
</ul><h2 id="m822428" class="letternav-head">M</h2>
<ul><li><a href="/courses/m_s/">M S-Military Science - Army</a></li><li><a href="/courses/math/">MATH-Mathematics</a></li><li><a href="/courses/mbio/">MBIO-Microbiology</a></li><li><a href="/courses/metr/">METR-Meteorology</a></li><li><a href="/courses/mgt/">MGT-Management </a></li><li><a href="/courses/mis/">MIS-Management Information Systems </a></li><li><a href="/courses/mit/">MIT-Management Information Technology</a></li><li><a href="/courses/mkt/">MKT-Marketing</a></li><li><a href="/courses/mlll/">MLLL-Modern Languages, Literatures, &amp; Linguistics</a></li><li><a href="/courses/mrs/">MRS-Medieval and Renaissance</a></li><li><a href="/courses/mst/">MST-Museum Studies</a></li><li><a href="/courses/mthr/">MTHR-Musical Theatre</a></li><li><a href="/courses/mued/">MUED-Music Education</a></li><li><a href="/courses/muli/">MULI-Music Literature</a></li><li><a href="/courses/munm/">MUNM-Music for Non-Majors</a></li><li><a href="/courses/mus/">MUS-Music</a></li><li><a href="/courses/musc/">MUSC-Musicology</a></li><li><a href="/courses/mute/">MUTE-Music Technique</a></li><li><a href="/courses/muth/">MUTH-Music Theory</a></li><li><a href="/courses/mutk/">MUTK-Music Technology</a></li>
</ul><h2 id="n822428" class="letternav-head">N</h2>
<ul><li><a href="/courses/n_s/">N S-Naval Science</a></li><li><a href="/courses/nas/">NAS-Native American Studies</a></li><li><a href="/courses/npng/">NPNG-Nonprofit &amp; Nongovernmental Organizations</a></li>
</ul><h2 id="o822428" class="letternav-head">O</h2>
<ul><li><a href="/courses/oboe/">OBOE-Oboe</a></li><li><a href="/courses/ocl/">OCL-Organizational and Community Leadership</a></li><li><a href="/courses/odyn/">ODYN-Organizational Dynamics</a></li><li><a href="/courses/ol/">OL-Organizational Leadership</a></li><li><a href="/courses/orgn/">ORGN-Organ</a></li>
</ul><h2 id="p822428" class="letternav-head">P</h2>
<ul><li><a href="/courses/p_e/">P E-Petroleum Engineering</a></li><li><a href="/courses/p_sc/">P SC-Political Science</a></li><li><a href="/courses/pbio/">PBIO-Plant Biology</a></li><li><a href="/courses/pcus/">PCUS-Percussion</a></li><li><a href="/courses/pdc/">PDC-Planning, Design &amp; Construction</a></li><li><a href="/courses/pers/">PERS-Persian</a></li><li><a href="/courses/phch/">PHCH-Public Health and Community Health</a></li><li><a href="/courses/phil/">PHIL-Philosophy</a></li><li><a href="/courses/phys/">PHYS-Physics</a></li><li><a href="/courses/pian/">PIAN-Piano</a></li><li><a href="/courses/port/">PORT-Portuguese</a></li><li><a href="/courses/pota/">POTA-Potawatomi</a></li><li><a href="/courses/psad/">PSAD-PACS Aerospace &amp; Defense</a></li><li><a href="/courses/psba/">PSBA-PACS Business Administration</a></li><li><a href="/courses/pscj/">PSCJ-PACS Criminal Justice</a></li><li><a href="/courses/pscs/">PSCS-PACS Computer &amp; Data Science</a></li><li><a href="/courses/psha/">PSHA-PACS Health Administration</a></li><li><a href="/courses/pshu/">PSHU-PACS Humanities</a></li><li><a href="/courses/psis/">PSIS-PACS Integrative Studies</a></li><li><a href="/courses/psms/">PSMS-PACS Math</a></li><li><a href="/courses/psns/">PSNS-PACS Natural Sciences</a></li><li><a href="/courses/psol/">PSOL-PACS Organizational Leadership</a></li><li><a href="/courses/pssc/">PSSC-PACS Social Sciences</a></li><li><a href="/courses/psy/">PSY-Psychology</a></li>
</ul><h2 id="r822428" class="letternav-head">R</h2>
<ul><li><a href="/courses/rcpl/">RCPL-Regional &amp; City Planning</a></li><li><a href="/courses/rels/">RELS-Religious Studies</a></li><li><a href="/courses/rphd/">RPHD-Music Recitals</a></li><li><a href="/courses/russ/">RUSS-Russian</a></li>
</ul><h2 id="s822428" class="letternav-head">S</h2>
<ul><li><a href="/courses/s_wk/">S WK-Social Work</a></li><li><a href="/courses/sax/">SAX-Saxophone</a></li><li><a href="/courses/scm/">SCM-Supply Chain Management </a></li><li><a href="/courses/ses/">SES-Sustainable Energy Systems</a></li><li><a href="/courses/soc/">SOC-Sociology</a></li><li><a href="/courses/span/">SPAN-Spanish</a></li><li><a href="/courses/srre/">SRRE-Music Recitals</a></li>
</ul><h2 id="t822428" class="letternav-head">T</h2>
<ul><li><a href="/courses/tesl/">TESL-TESOL</a></li><li><a href="/courses/trmp/">TRMP-Trumpet</a></li><li><a href="/courses/trom/">TROM-Trombone</a></li><li><a href="/courses/tuba/">TUBA-Tuba</a></li>
</ul><h2 id="u822428" class="letternav-head">U</h2>
<ul><li><a href="/courses/ugre/">UGRE-Music Recitals</a></li><li><a href="/courses/univ/">UNIV-University Course</a></li>
</ul><h2 id="v822428" class="letternav-head">V</h2>
<ul><li><a href="/courses/vioa/">VIOA-Viola</a></li><li><a href="/courses/viol/">VIOL-Violin</a></li><li><a href="/courses/voic/">VOIC-Voice</a></li>
</ul><h2 id="w822428" class="letternav-head">W</h2>
<ul><li><a href="/courses/wgs/">WGS-Women's &amp; Gender Studies</a></li></ul></div></div>
`;

    // start scraping those departments from the htmlcourses
    await scrapeDepartments(htmlcourses);

    // this gets the departments from the database we had scraped and placed the info into so that we can scrapecourses with them
    const departments = await getDepartments();

    // This will log an array of department links
    console.log(departments);  
   
    // This will start the scraping courses process, we are putting basically our department catalog ('Dept name','Dept link')
    // but inside the scrapeCourses you will see we only utilize the dept link, as we are scraping the courses from those!!
    await scrapeCourses(departments);

    await scrapeMajors();

} catch (error) {
    console.error("Error in main function:", error.message);
} finally {
    db.close((err) => {
        if (err) {
            console.error("Error closing database:", err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}
};


main();