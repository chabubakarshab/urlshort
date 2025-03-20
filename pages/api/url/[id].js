// API endpoint to get URL data by ID

// Import the URL database from the shorten.js file
// In a real application, you would use a database
import { getUrlDatabase } from '../shorten';

export default function handler(req, res) {
  const { id } = req.query;
  const urlDatabase = getUrlDatabase();

  // Handle GET request to fetch URL data
  if (req.method === 'GET') {
    // Check if the URL exists
    if (!urlDatabase[id]) {
      return res.status(404).json({ 
        success: false, 
        error: 'URL not found' 
      });
    }

    // Increment view count
    urlDatabase[id].views = (urlDatabase[id].views || 0) + 1;

    // Return URL data
    return res.status(200).json({
      success: true,
      data: {
        shortCode: id,
        ...urlDatabase[id]
      }
    });
  }

  // Method not allowed
  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed' 
  });
}
