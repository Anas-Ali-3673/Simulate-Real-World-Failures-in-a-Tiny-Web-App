// Mock product data
const products = [
  { id: 1, name: "Wireless Headphones", price: 79.99, stock: 45 },
  { id: 2, name: "Smart Watch", price: 199.99, stock: 23 },
  { id: 3, name: "Laptop Stand", price: 34.99, stock: 67 },
  { id: 4, name: "USB-C Hub", price: 49.99, stock: 32 },
  { id: 5, name: "Mechanical Keyboard", price: 129.99, stock: 18 },
  { id: 6, name: "Webcam HD", price: 89.99, stock: 41 },
  { id: 7, name: "Mouse Pad XL", price: 24.99, stock: 95 },
  { id: 8, name: "Monitor 27\"", price: 299.99, stock: 12 },
  { id: 9, name: "Desk Lamp LED", price: 39.99, stock: 56 },
  { id: 10, name: "Cable Organizer", price: 14.99, stock: 103 }
];

// Logger utility
function logRequest(logData) {
  const structuredLog = {
    timestamp: new Date().toISOString(),
    url: logData.url,
    method: logData.method,
    latencyMs: logData.latencyMs,
    statusOrReason: logData.statusOrReason,
    errorCode: logData.errorCode || null,
    message: logData.message || null
  };
  
  console.log(JSON.stringify(structuredLog, null, 2));
  return structuredLog;
}

export default async function handler(req, res) {
  const startTime = Date.now();
  const url = '/api/products';
  const method = req.method;
  
  // Only allow GET requests
  if (method !== 'GET') {
    const latencyMs = Date.now() - startTime;
    logRequest({
      url,
      method,
      latencyMs,
      statusOrReason: 405,
      errorCode: 'METHOD_NOT_ALLOWED',
      message: 'Only GET requests are allowed'
    });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read the failure mode from query parameter
  const { failureMode } = req.query;

  // FAILURE INJECTION: Simulate network timeout
  if (failureMode === 'timeout') {
    // Simulate a slow response that times out (10 seconds delay)
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const latencyMs = Date.now() - startTime;
    logRequest({
      url,
      method,
      latencyMs,
      statusOrReason: 'TIMEOUT',
      errorCode: 'NET_TIMEOUT',
      message: 'Request timed out - server took too long to respond'
    });
    
    return res.status(504).json({
      error: 'Network failure: request timed out',
      errorCode: 'NET_TIMEOUT',
      timestamp: new Date().toISOString()
    });
  }

  // FAILURE INJECTION: Simulate 503 Service Unavailable
  if (failureMode === '503') {
    // Small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const latencyMs = Date.now() - startTime;
    logRequest({
      url,
      method,
      latencyMs,
      statusOrReason: 503,
      errorCode: 'NET_503',
      message: '503 Service Unavailable - server temporarily unavailable'
    });
    
    return res.status(503).json({
      error: 'Network failure: 503 Service Unavailable',
      errorCode: 'NET_503',
      timestamp: new Date().toISOString()
    });
  }

  // HAPPY PATH: Normal successful response
  try {
    // Simulate realistic network latency
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const latencyMs = Date.now() - startTime;
    logRequest({
      url,
      method,
      latencyMs,
      statusOrReason: 200,
      message: 'Successfully retrieved products'
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    logRequest({
      url,
      method,
      latencyMs,
      statusOrReason: 500,
      errorCode: 'INTERNAL_ERROR',
      message: error.message
    });
    
    res.status(500).json({
      error: 'Internal server error',
      errorCode: 'INTERNAL_ERROR'
    });
  }
}
