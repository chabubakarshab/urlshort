// This is a simple API endpoint to create shortened URLs
// In a production environment, you would use a database instead of in-memory storage

// In-memory database to store shortened URLs
// This will be reset when the server restarts
let urlDatabase = {};

// Generate a random short code
function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Add some demo entries to the database
urlDatabase['demo1'] = {
  originalUrl: 'https://scontent-lax.cdninstagram.com/v/t1.15752-9/483756777_1067305745413222_1271431596689012493_n.png?stp=dst-png_s720x720&_nc_cat=101&ccb=1-7&_nc_sid=0024fc',
  title: 'Demo Instagram Image',
  createdAt: new Date().toISOString()
};

export default function handler(req, res) {
  // Handle GET request to retrieve all shortened URLs
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: urlDatabase
    });
  }
  
  // Only allow POST requests for creating new shortened URLs
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
  
  // Store in our database
  urlDatabase[shortCode] = {
    originalUrl: url,
    title: title || 'Instagram Image',
    createdAt: new Date().toISOString()
  };
  
  // Get the base URL
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
  
  // Return the shortened URL
  return res.status(200).json({
    shortCode,
    shortUrl: `${baseUrl}/${shortCode}`,
    originalUrl: url
  });
}
