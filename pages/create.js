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
        <title>Create Shortened URL</title>
        <meta name="description" content="Create a shortened URL for Instagram images" />
      </Head>
      
      <h1>Create Shortened URL</h1>
      <p>Enter an Instagram CDN URL to create a shortened link that works on Facebook.</p>
      
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
            <strong>Instructions:</strong>
          </p>
          <ol>
            <li>Copy the short URL above</li>
            <li>Paste it into Facebook to share</li>
            <li>Facebook will display the image using its own CDN</li>
            <li>This helps bypass Facebook's content filters</li>
          </ol>
          
          <p>
            <a 
              href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(result.shortUrl)}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#4267B2',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                marginTop: '1rem'
              }}
            >
              Test with Facebook Debugger
            </a>
          </p>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <h2>How It Works</h2>
        <ol>
          <li>You provide an Instagram CDN URL</li>
          <li>We create a special page with meta tags optimized for Facebook</li>
          <li>When Facebook crawls your shortened URL, it sees these special meta tags</li>
          <li>Facebook processes the image and creates its own CDN link</li>
          <li>This makes the image appear to be coming directly from Facebook's CDN</li>
          <li>Regular users who click the link are redirected to the original Instagram image</li>
        </ol>
      </div>
    </div>
  );
}
