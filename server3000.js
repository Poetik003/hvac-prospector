const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const flaskApiPort = 8000;

const server = http.createServer((req, res) => {
    // Proxy API requests to Flask server
    if (req.url.startsWith('/api/')) {
        console.log(`🔄 Proxying API request: ${req.method} ${req.url}`);
        
        const options = {
            hostname: 'localhost',
            port: flaskApiPort,
            path: req.url,
            method: req.method,
            headers: {
                ...req.headers,
                'host': `localhost:${flaskApiPort}`
            }
        };
        
        const proxyReq = http.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
                ...proxyRes.headers,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            proxyRes.pipe(res);
        });
        
        proxyReq.on('error', (err) => {
            console.error('❌ Proxy error:', err);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Voice API service unavailable', details: err.message }));
        });
        
        req.pipe(proxyReq);
        return;
    }
    
    // Handle OPTIONS requests for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }
    
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
        case '.mp4':
            contentType = 'video/mp4';
            break;
    }
    
    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end('File not found');
            } else {
                res.writeHead(500, { 
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                });
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
    console.log(`🚀 ProSpector Pro running at http://0.0.0.0:${port}/`);
    console.log(`📱 Access your HVAC sales dashboard now!`);
});