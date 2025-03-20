# Instagram URL Shortener

This is a Next.js application that creates shortened URLs for Instagram CDN images. The shortened URLs display the original Instagram CDN images directly when shared.

## Features

- Create shortened URLs for Instagram CDN images
- Meta tags optimized for social media sharing
- Random elements to make each post look unique
- Works with Instagram CDN URLs
- Simple, easy-to-use interface

## How It Works

1. You provide an Instagram CDN URL
2. The application creates a shortened URL
3. When the shortened URL is shared, it displays the original Instagram CDN image
4. Regular users who click the link are redirected to the original Instagram image

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

1. Go to the `/create` page
2. Enter an Instagram CDN URL
3. Click "Create Shortened URL"
4. Copy the shortened URL
5. Share it wherever you want

## Example

Here's an example of how to use the application:

1. Find an Instagram image URL (must contain cdninstagram.com, fbcdn.net, or scontent)
2. Go to `https://your-vercel-app.vercel.app/create`
3. Enter the URL and click "Create Shortened URL"
4. Share the shortened URL

## Notes

- This application only works with Instagram CDN URLs
- The shortened URLs are stored in memory and will be lost when the server restarts (in a production environment, you would use a database)
