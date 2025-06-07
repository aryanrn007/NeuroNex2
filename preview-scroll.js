/**
 * Simple preview server for testing the scroll snapping functionality
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    // Normalize URL to prevent directory traversal
    let url = req.url;
    if (url === '/') {
        url = '/neuronex-landing.html';
    }
    
    // Get the file path
    const filePath = path.join(__dirname, url);
    const extname = path.extname(filePath);
    
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        
        // Set the content type
        const contentType = MIME_TYPES[extname] || 'text/plain';
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`Error reading file: ${err}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Open http://localhost:${PORT}/neuronex-landing.html to view the scroll snapping demo`);
});
