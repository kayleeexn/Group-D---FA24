const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port
const PORT = 8000;

// Create the server
http.createServer((req, res) => {
    // Set the file path
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Get the file extension
    let extname = path.extname(filePath);
    
    // Set default content type
    let contentType = 'text/html';

    // Check the file extension and set the correct content type
    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    // Read the file and serve it
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(content, 'utf8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success, send the file
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content, 'utf8');
        }
    });
}).listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
