// API endpoint to get URL data by ID

// Import the URL database from the shorten.js file
// In a real application, you would use a database
import { getUrlDatabase } from '../shorten';

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { id } = req.query;
  
  // Get the URL database
  const urlDatabase = getUrlDatabase();
  
  // Check if the ID exists in the database
  if (!urlDatabase[id]) {
    return res.status(404).json({ error: 'URL not found' });
  }
  
  // Return the URL data
  return res.status(200).json(urlDatabase[id]);
}
