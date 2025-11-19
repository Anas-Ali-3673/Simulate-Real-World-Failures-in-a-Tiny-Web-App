// DOM Elements
const failureToggle = document.getElementById('failureToggle');
const loadProductsBtn = document.getElementById('loadProducts');
const productList = document.getElementById('productList');
const errorBanner = document.getElementById('errorBanner');
const errorMessage = document.getElementById('errorMessage');
const closeErrorBtn = document.getElementById('closeError');
const loadingIndicator = document.getElementById('loadingIndicator');
const consoleLog = document.getElementById('consoleLog');

// Configuration
const REQUEST_TIMEOUT = 3000; // 3 seconds

// Mock product data (simulating backend)
const MOCK_PRODUCTS = [
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

// State
let requestStartTime = null;

// Event Listeners
loadProductsBtn.addEventListener('click', loadProducts);
closeErrorBtn.addEventListener('click', hideErrorBanner);

// Main function to load products
async function loadProducts() {
    hideErrorBanner();
    showLoading();
    clearProducts();
    
    const failureEnabled = failureToggle.checked;
    const failureType = document.querySelector('input[name="failureType"]:checked').value;
    
    requestStartTime = Date.now();
    
    try {
        const products = await fetchProducts(failureEnabled, failureType);
        displayProducts(products);
        logSuccess(products.length);
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

// Simulate fetching products with potential failures (client-side simulation)
async function fetchProducts(failureEnabled, failureType) {
    const url = window.location.href + 'api/products' + (failureEnabled ? `?failure=${failureType}` : '');
    const method = 'GET';
    
    if (failureEnabled && failureType === 'timeout') {
        // Simulate timeout: delay longer than timeout threshold
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                const latencyMs = Date.now() - requestStartTime;
                const errorData = {
                    timestamp: new Date().toISOString(),
                    url: url,
                    method: method,
                    latencyMs: latencyMs,
                    statusOrReason: 'Request timeout',
                    errorCode: 'NET_TIMEOUT',
                    message: `Network failure: request timed out (exceeded ${REQUEST_TIMEOUT}ms)`,
                    timeoutThreshold: REQUEST_TIMEOUT
                };
                reject(new NetworkError(errorData));
            }, REQUEST_TIMEOUT + 100); // Slightly over timeout to trigger
        });
        
        return await timeoutPromise;
    }
    
    if (failureEnabled && failureType === '503') {
        // Simulate 503 Service Unavailable
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for realism
        
        const latencyMs = Date.now() - requestStartTime;
        const errorData = {
            timestamp: new Date().toISOString(),
            url: url,
            method: method,
            latencyMs: latencyMs,
            statusCode: 503,
            statusText: 'Service Unavailable',
            errorCode: 'NET_503',
            message: 'Network failure: 503 Service Unavailable'
        };
        
        throw new NetworkError(errorData);
    }
    
    // Normal happy path - simulate successful API call
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    return MOCK_PRODUCTS;
}

// Custom Network Error class
class NetworkError extends Error {
    constructor(data) {
        super(data.message);
        this.name = 'NetworkError';
        this.data = data;
    }
}

// Display products in the grid
function displayProducts(products) {
    productList.innerHTML = '';
    
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <span class="category">${product.category}</span>
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="stock">Stock: ${product.stock} units</p>
        `;
        
        productList.appendChild(card);
    });
}

// Handle errors
function handleError(error) {
    if (error instanceof NetworkError) {
        // Log structured error to console
        logErrorToConsole(error.data);
        
        // Show user-friendly error banner
        showErrorBanner(error.data.message);
    } else {
        // Fallback for unexpected errors
        const genericError = {
            timestamp: new Date().toISOString(),
            errorCode: 'UNKNOWN_ERROR',
            message: error.message || 'An unexpected error occurred'
        };
        
        logErrorToConsole(genericError);
        showErrorBanner(genericError.message);
    }
}

// Log structured error to console (JSON format)
function logErrorToConsole(errorData) {
    const logEntry = JSON.stringify(errorData, null, 2);
    
    // Log to browser console
    console.error('Network Error:', errorData);
    
    // Display in UI console
    const timestamp = new Date().toLocaleTimeString();
    consoleLog.textContent = `[${timestamp}] ERROR LOG:\n${logEntry}`;
}

// Log success
function logSuccess(productCount) {
    const successData = {
        timestamp: new Date().toISOString(),
        url: window.location.href + 'api/products',
        method: 'GET',
        latencyMs: Date.now() - requestStartTime,
        status: 200,
        productCount: productCount,
        message: 'Products loaded successfully'
    };
    
    const logEntry = JSON.stringify(successData, null, 2);
    console.log('Success:', successData);
    
    const timestamp = new Date().toLocaleTimeString();
    consoleLog.textContent = `[${timestamp}] SUCCESS LOG:\n${logEntry}`;
}

// UI Helper Functions
function showErrorBanner(message) {
    errorMessage.textContent = message;
    errorBanner.classList.remove('hidden');
}

function hideErrorBanner() {
    errorBanner.classList.add('hidden');
}

function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function clearProducts() {
    productList.innerHTML = '';
}

// Visual feedback for toggle state
failureToggle.addEventListener('change', (e) => {
    const failureTypeSelector = document.querySelector('.failure-type-selector');
    if (e.target.checked) {
        failureTypeSelector.style.opacity = '1';
        failureTypeSelector.style.pointerEvents = 'auto';
        console.log(' Failure mode ENABLED');
    } else {
        failureTypeSelector.style.opacity = '0.5';
        failureTypeSelector.style.pointerEvents = 'none';
        console.log('Failure mode DISABLED - Normal operation');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Product Store App Initialized (GitHub Pages Version)');
    console.log('Toggle the "Failure Mode" switch and click "Load Products" to simulate network failures');
    console.log(' Note: This is a client-side simulation running entirely in your browser');
    
    // Set initial state
    const failureTypeSelector = document.querySelector('.failure-type-selector');
    failureTypeSelector.style.opacity = '0.5';
    failureTypeSelector.style.pointerEvents = 'none';
});
