# Instagram URL Shortener & WordPress Integration

This is a Next.js application that creates shortened URLs for Instagram CDN images and integrates with WordPress to display posts. The shortened URLs display the original Instagram CDN images directly when shared.

## Features

- Create shortened URLs for Instagram CDN images
- WordPress integration to fetch and display posts using GraphQL
- Dynamic routing for WordPress posts
- Meta tags optimized for social media sharing
- Random elements to make each post look unique
- Works with Instagram CDN URLs
- Simple, easy-to-use interface

## How It Works

### URL Shortener
1. You provide an Instagram CDN URL
2. The application creates a shortened URL
3. When the shortened URL is shared, it displays the original Instagram CDN image
4. Regular users who click the link are redirected to the original Instagram image

### WordPress Integration
1. The application fetches posts from a WordPress site using GraphQL
2. Posts are displayed on the homepage with featured images and excerpts
3. Clicking on a post opens it in a dynamic route
4. The application handles redirects for social media referrers

## Deployment

### Deploy to Vercel

The easiest way to deploy this application is to use Vercel:

1. Push this code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Create a new project and import your GitHub repository
4. Deploy the application

### Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### URL Shortener
1. Go to the `/create` page
2. Enter an Instagram CDN URL
3. Click "Create Shortened URL"
4. Copy the shortened URL
5. Share it wherever you want

### WordPress Posts
1. Visit the homepage to see the latest WordPress posts
2. Click on any post to view its full content
3. If the referrer is from a social media platform (e.g., Facebook), the user will be redirected to the original WordPress site

## Example

Here's an example of how to use the application:

1. Find an Instagram image URL (must contain cdninstagram.com, fbcdn.net, or scontent)
2. Go to `https://your-vercel-app.vercel.app/create`
3. Enter the URL and click "Create Shortened URL"
4. Share the shortened URL

## WordPress GraphQL Integration

This application connects to a WordPress site at `https://wyseducation.xyz/graphql` to fetch posts.

The integration:
- Fetches posts for the homepage
- Provides a dynamic route for viewing full posts
- Handles social media redirects to the original WordPress site
- Includes meta tags and Open Graph tags for enhanced social sharing

## Notes

- The URL shortener functionality only works with Instagram CDN URLs
- The shortened URLs are stored in memory and will be lost when the server restarts (in a production environment, you would use a database)
- For WordPress integration to work, the WordPress site must have the WPGraphQL plugin installed
