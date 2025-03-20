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
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Something went wrong');
      }
      
      setResult(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.container}>
      <Head>
        <title>Instagram URL Shortener</title>
        <meta name="description" content="Create shortened URLs for Instagram images" />
      </Head>
      
      <main style={styles.main}>
        <h1 style={styles.title}>Instagram URL Shortener</h1>
        <p style={styles.description}>Enter an Instagram CDN URL to create a shortened link.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="url" style={styles.label}>
              Instagram CDN URL
              <span style={styles.required}>*</span>
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={styles.input}
              placeholder="https://scontent-lax.cdninstagram.com/..."
            />
            <small style={styles.hint}>Must contain cdninstagram.com, fbcdn.net, or scontent</small>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              placeholder="My Instagram Image"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Creating...' : 'Create Shortened URL'}
          </button>
        </form>
        
        {error && (
          <div style={styles.error}>
            Error: {error}
          </div>
        )}
        
        {result && (
          <div style={styles.result}>
            <h2 style={styles.resultTitle}>Shortened URL Created!</h2>
            <div style={styles.resultGroup}>
              <label style={styles.resultLabel}>Short URL:</label>
              <div style={styles.resultValue}>
                <a 
                  href={result.shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  {result.shortUrl}
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.shortUrl);
                    alert('URL copied to clipboard!');
                  }}
                  style={styles.copyButton}
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div style={styles.resultGroup}>
              <label style={styles.resultLabel}>Original URL:</label>
              <div style={styles.resultValue}>
                <a 
                  href={result.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  {result.originalUrl.substring(0, 50)}...
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '0 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
  main: {
    padding: '5rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
  },
  title: {
    margin: 0,
    lineHeight: 1.15,
    fontSize: '4rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  description: {
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '1.5rem',
    marginBottom: '2rem',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
  },
  required: {
    color: '#ff0000',
    marginLeft: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '0.25rem',
  },
  hint: {
    color: '#666',
    fontSize: '0.875rem',
  },
  button: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  error: {
    color: '#ff0000',
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff5f5',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '600px',
  },
  result: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
  },
  resultTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  resultGroup: {
    marginBottom: '1rem',
  },
  resultLabel: {
    display: 'block',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
  resultValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
    wordBreak: 'break-all',
    flex: 1,
  },
  copyButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
