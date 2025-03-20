// This is a simple API endpoint to create shortened URLs
// In a real application, you would store this in a database

// Generate a random short code
function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Mock database of shortened URLs
let urlDatabase = {};

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get the URL and title from the request body
  const { url, title } = req.body;
  
  // Validate URL
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  // Check if it's an Instagram CDN URL
  const isInstagramUrl = 
    url.includes('cdninstagram.com') || 
    url.includes('fbcdn.net') || 
    url.includes('scontent');
  
  if (!isInstagramUrl) {
    return res.status(400).json({ error: 'Only Instagram CDN URLs are supported' });
  }
  
  // Generate a short code
  const shortCode = generateShortCode();
  
  // Store in our mock database
  urlDatabase[shortCode] = {
    originalUrl: url,
    title: title || 'Instagram Image',
    createdAt: new Date().toISOString()
  };
  
  // Get the base URL
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : `http://${req.headers.host}`;
  
  // Return the shortened URL
  return res.status(200).json({
    shortCode,
    shortUrl: `${baseUrl}/${shortCode}`,
    originalUrl: url
  });
}
