// This is a simple API endpoint to create shortened URLs
// In a production environment, you would use a database instead of in-memory storage

// URL database to store shortened URLs
const urlDatabase = {};

// Export the database for other API routes
export function getUrlDatabase() {
  return urlDatabase;
}

// Validate Instagram CDN URL
function isValidInstagramUrl(url) {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes('cdninstagram.com') ||
      urlObj.hostname.includes('fbcdn.net') ||
      urlObj.hostname.includes('scontent')
    );
  } catch {
    return false;
  }
}

// Generate a random short code
function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if this code is already in use
    if (!urlDatabase[result]) {
      return result;
    }
    attempts++;
  }
  
  // If we couldn't generate a unique code, add timestamp
  return result + Date.now().toString(36);
}

// Add some demo entries to the database
urlDatabase['demo1'] = {
  originalUrl: 'https://scontent-lax.cdninstagram.com/v/t1.15752-9/483756777_1067305745413222_1271431596689012493_n.png?stp=dst-png_s720x720&_nc_cat=101&ccb=1-7&_nc_sid=0024fc',
  title: 'Demo Instagram Image',
  createdAt: new Date().toISOString(),
  views: 0
};

export default function handler(req, res) {
  // Handle GET request to retrieve all shortened URLs
  if (req.method === 'GET') {
    const urls = Object.entries(urlDatabase).map(([shortCode, data]) => ({
      shortCode,
      ...data,
    }));
    return res.status(200).json({ urls });
  }
  
  // Only allow POST requests for creating new shortened URLs
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get the URL and title from the request body
  const { url, title } = req.body;
  
  // Validate URL presence
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  // Validate URL format
  if (!isValidInstagramUrl(url)) {
    return res.status(400).json({ 
      error: 'Invalid URL. Must be an Instagram CDN URL (containing cdninstagram.com, fbcdn.net, or scontent)' 
    });
  }
  
  // Generate a short code
  const shortCode = generateShortCode();
  
  // Store in our database
  urlDatabase[shortCode] = {
    originalUrl: url,
    title: title || 'Instagram Image',
    createdAt: new Date().toISOString(),
    views: 0
  };
  
  // Get the base URL
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
  
  // Return the shortened URL
  return res.status(200).json({
    success: true,
    data: {
      shortCode,
      shortUrl: `${baseUrl}/${shortCode}`,
      originalUrl: url,
      title: title || 'Instagram Image',
      createdAt: urlDatabase[shortCode].createdAt
    }
  });
}
