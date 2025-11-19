const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Sample product data
const products = [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 89.99, stock: 45 },
    { id: 2, name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 23 },
    { id: 3, name: 'Laptop Stand', category: 'Accessories', price: 34.99, stock: 67 },
    { id: 4, name: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 102 },
    { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, stock: 18 },
    { id: 6, name: 'Ergonomic Mouse', category: 'Accessories', price: 39.99, stock: 88 },
    { id: 7, name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 34 },
    { id: 8, name: 'Desk Lamp', category: 'Furniture', price: 29.99, stock: 56 },
    { id: 9, name: 'Monitor 27"', category: 'Electronics', price: 299.99, stock: 12 },
    { id: 10, name: 'Cable Organizer', category: 'Accessories', price: 14.99, stock: 150 },
    { id: 11, name: 'Portable SSD 1TB', category: 'Storage', price: 119.99, stock: 41 },
    { id: 12, name: 'Bluetooth Speaker', category: 'Audio', price: 59.99, stock: 72 }
];

// API Routes

// GET /api/products - Fetch all products (with optional failure simulation)
app.get('/api/products', async (req, res) => {
    const { failure } = req.query;
    
    console.log(`\n[${new Date().toISOString()}] Incoming request to /api/products`);
    console.log(`Failure mode: ${failure || 'none'}`);
    
    // Simulate failures based on query parameter
    if (failure === 'timeout') {
        // Simulate a slow response that will timeout on client
        console.log('⏱️ Simulating TIMEOUT - delaying response by 5 seconds...');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // By the time we respond, client should have already timed out
        const errorLog = {
            timestamp: new Date().toISOString(),
            endpoint: '/api/products',
            method: 'GET',
            simulatedFailure: 'timeout',
            actualDelay: '5000ms',
            clientTimeout: '3000ms',
            errorCode: 'NET_TIMEOUT',
            message: 'Response delayed beyond client timeout threshold'
        };
        
        console.log('ERROR LOG:', JSON.stringify(errorLog, null, 2));
        
        // Send response anyway (client won't receive it due to timeout)
        res.status(200).json(products);
        return;
    }
    
    if (failure === '503') {
        // Simulate 503 Service Unavailable
        console.log('🔴 Simulating 503 SERVICE UNAVAILABLE...');
        
        const errorLog = {
            timestamp: new Date().toISOString(),
            endpoint: '/api/products',
            method: 'GET',
            statusCode: 503,
            statusText: 'Service Unavailable',
            simulatedFailure: '503',
            errorCode: 'NET_503',
            message: 'Server is temporarily unable to handle the request',
            retryAfter: '60 seconds'
        };
        
        console.log('ERROR LOG:', JSON.stringify(errorLog, null, 2));
        
        res.status(503).json({
            error: 'Service Unavailable',
            message: 'The server is temporarily unable to handle your request. Please try again later.',
            code: 'NET_503',
            retryAfter: 60
        });
        return;
    }
    
    // Normal happy path - return products
    console.log(`✅ Returning ${products.length} products successfully`);
    
    const successLog = {
        timestamp: new Date().toISOString(),
        endpoint: '/api/products',
        method: 'GET',
        statusCode: 200,
        productCount: products.length,
        message: 'Products retrieved successfully'
    };
    
    console.log('SUCCESS LOG:', JSON.stringify(successLog, null, 2));
    
    res.status(200).json(products);
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.url} not found`,
        code: 'NET_404'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    
    const errorLog = {
        timestamp: new Date().toISOString(),
        error: err.message,
        stack: err.stack,
        errorCode: 'SERVER_ERROR'
    };
    
    console.log('ERROR LOG:', JSON.stringify(errorLog, null, 2));
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        code: 'SERVER_ERROR'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Product Store Server Started');
    console.log('='.repeat(60));
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/api/products`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log('='.repeat(60));
    console.log('\n💡 Failure Simulation Options:');
    console.log('   • Timeout: /api/products?failure=timeout (5s delay)');
    console.log('   • 503 Error: /api/products?failure=503');
    console.log('   • Normal: /api/products (no failure)\n');
    console.log('✨ Ready to accept requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully...');
    process.exit(0);
});
