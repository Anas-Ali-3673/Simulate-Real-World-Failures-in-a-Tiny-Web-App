import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [failureMode, setFailureMode] = useState('none');
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      // Build URL with failure mode query parameter
      const url = failureMode !== 'none' 
        ? `/api/products?failureMode=${failureMode}`
        : '/api/products';

      // Set a client-side timeout of 5 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const fetchTime = Date.now() - startTime;
      setLastFetchTime(fetchTime);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.data);
      setLoading(false);
    } catch (err) {
      const fetchTime = Date.now() - startTime;
      setLastFetchTime(fetchTime);
      
      // Handle different error types
      if (err.name === 'AbortError') {
        setError('Network failure: request timed out (client timeout: 5000ms)');
      } else {
        setError(err.message);
      }
      setProducts([]);
      setLoading(false);
    }
  };

  // Auto-fetch on mount and when failure mode changes
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFailureToggle = (mode) => {
    setFailureMode(mode);
  };

  return (
    <>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        * {
          box-sizing: border-box;
        }

        button {
          font-family: inherit;
        }
      `}</style>
      <div className={styles.container}>
      <Head>
        <title>Product List - Network Failure Simulator</title>
        <meta name="description" content="Simulate network failures in product listing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Product List 
        </h1>

        <p className={styles.description}>
          Network Failure Simulation 
        </p>

        {/* Failure Toggle Controls */}
        <div className={styles.controls}>
          <h2>Failure Toggle</h2>
          <div className={styles.toggleGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="failureMode"
                value="none"
                checked={failureMode === 'none'}
                onChange={(e) => handleFailureToggle(e.target.value)}
              />
              <span>Normal (Happy Path)</span>
            </label>
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="failureMode"
                value="timeout"
                checked={failureMode === 'timeout'}
                onChange={(e) => handleFailureToggle(e.target.value)}
              />
              <span>Simulate Timeout</span>
            </label>
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="failureMode"
                value="503"
                checked={failureMode === '503'}
                onChange={(e) => handleFailureToggle(e.target.value)}
              />
              <span> Simulate 503 Error</span>
            </label>
          </div>

          <button 
            className={styles.fetchButton}
            onClick={fetchProducts}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Products'}
          </button>

          {lastFetchTime !== null && (
            <div className={styles.fetchTime}>
              Last request took: {lastFetchTime}ms
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className={styles.errorBanner}>
            <h3>⚠️ System Error</h3>
            <p>{error}</p>
            <small>Check browser console for detailed structured logs</small>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Fetching products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <h3>{product.name}</h3>
                <p className={styles.price}>${product.price}</p>
                <p className={styles.stock}>
                  {product.stock > 0 
                    ? `In stock: ${product.stock} units`
                    : 'Out of stock'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className={styles.emptyState}>
            <p>No products available. Click "Fetch Products" to load.</p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Network Failure Simulator - Option D: Timeout / 503 Service Unavailable</p>
      </footer>
    </div>
    </>
  );
}
