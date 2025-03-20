import { useState } from 'react';
import Head from 'next/head';

export default function Create() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, title }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <Head>
        <title>Instagram URL Shortener</title>
        <meta name="description" content="Create a shortened URL for Instagram images" />
      </Head>
      
      <h1>Instagram URL Shortener</h1>
      <p>Enter an Instagram CDN URL to create a shortened link.</p>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="url" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Instagram CDN URL (must contain cdninstagram.com, fbcdn.net, or scontent)
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="https://scontent-lax.cdninstagram.com/..."
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="My Instagram Image"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create Shortened URL'}
        </button>
      </form>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Shortened URL Created!</h2>
          <p>
            <strong>Short URL:</strong>{' '}
            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
              {result.shortUrl}
            </a>
          </p>
          <p>
            <strong>Original URL:</strong>{' '}
            <a href={result.originalUrl} target="_blank" rel="noopener noreferrer">
              {result.originalUrl.substring(0, 50)}...
            </a>
          </p>
          <p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.shortUrl);
                alert('URL copied to clipboard!');
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Copy URL to Clipboard
            </button>
          </p>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <h2>How It Works</h2>
        <ol>
          <li>Enter an Instagram CDN URL</li>
          <li>We create a shortened URL for your image</li>
          <li>When shared, the image will be displayed directly from Instagram's CDN</li>
          <li>Regular users who click the link are redirected to the original Instagram image</li>
        </ol>
      </div>
    </div>
  );
}
