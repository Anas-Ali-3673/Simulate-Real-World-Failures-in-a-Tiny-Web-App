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
const API_BASE_URL = 'http://localhost:3000';
const REQUEST_TIMEOUT = 3000; // 3 seconds

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

// Fetch products from API with timeout
async function fetchProducts(failureEnabled, failureType) {
    const url = `${API_BASE_URL}/api/products${failureEnabled ? `?failure=${failureType}` : ''}`;
    const method = 'GET';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
        const response = await fetch(url, {
            method: method,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        const latencyMs = Date.now() - requestStartTime;
        
        if (!response.ok) {
            // Handle HTTP errors
            const errorData = {
                timestamp: new Date().toISOString(),
                url: url,
                method: method,
                latencyMs: latencyMs,
                statusCode: response.status,
                statusText: response.statusText,
                errorCode: response.status === 503 ? 'NET_503' : `NET_${response.status}`,
                message: `Network failure: ${response.status} ${response.statusText}`
            };
            
            throw new NetworkError(errorData);
        }
        
        return await response.json();
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            // Timeout occurred
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
            
            throw new NetworkError(errorData);
        }
        
        if (error instanceof NetworkError) {
            throw error;
        }
        
        // Other network errors (connection refused, etc.)
        const latencyMs = Date.now() - requestStartTime;
        const errorData = {
            timestamp: new Date().toISOString(),
            url: url,
            method: method,
            latencyMs: latencyMs,
            statusOrReason: error.message || 'Connection failed',
            errorCode: 'NET_CONNECTION_ERROR',
            message: `Network failure: ${error.message || 'Unable to connect to server'}`,
            originalError: error.name
        };
        
        throw new NetworkError(errorData);
    }
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
        url: `${API_BASE_URL}/api/products`,
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
        console.log('⚠️ Failure mode ENABLED');
    } else {
        failureTypeSelector.style.opacity = '0.5';
        failureTypeSelector.style.pointerEvents = 'none';
        console.log('✅ Failure mode DISABLED - Normal operation');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Product Store App Initialized');
    console.log('Toggle the "Failure Mode" switch and click "Load Products" to simulate network failures');
    
    // Set initial state
    const failureTypeSelector = document.querySelector('.failure-type-selector');
    failureTypeSelector.style.opacity = '0.5';
    failureTypeSelector.style.pointerEvents = 'none';
});
