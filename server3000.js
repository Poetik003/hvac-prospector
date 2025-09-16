const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('.'));

// Proxy API requests to Flask backend on port 8000
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '' // Remove /api prefix when forwarding to Flask
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('🔄 Proxying API request:', req.method, req.url);
    },
    onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
        res.status(500).json({ 
            success: false, 
            error: 'API service unavailable',
            message: err.message 
        });
    }
}));

// Default route - serve Index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Index.html'));
});

// Training route - serve training.html
app.get('/training', (req, res) => {
    res.sendFile(path.join(__dirname, 'training.html'));
});

app.get('/training.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'training.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'ProSpector HVAC Web Server',
        port: port,
        timestamp: new Date().toISOString()
    });
});

// Catch-all route for any other requests
app.get('*', (req, res) => {
    console.log('📄 Serving file:', req.path);
    res.sendFile(path.join(__dirname, req.path));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 ProSpector HVAC Web Server running on http://0.0.0.0:${port}`);
    console.log(`📄 Main App: http://0.0.0.0:${port}/`);
    console.log(`🎓 Training: http://0.0.0.0:${port}/training.html`);
    console.log(`🔗 API Proxy: http://0.0.0.0:${port}/api/* → http://localhost:8000/*`);
});