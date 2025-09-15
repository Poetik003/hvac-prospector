const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;
const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/Index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // Determine content type
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (ext) {
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
    
    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(content);
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Web server running at http://0.0.0.0:${port}/`);
    console.log(`📱 ProSpector Pro is now accessible at the above URL`);
});