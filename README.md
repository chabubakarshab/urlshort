# Instagram Image Shortener for Facebook

This is a Next.js application that creates shortened URLs for Instagram CDN images. When these shortened URLs are shared on Facebook, the images are displayed using Facebook's own CDN, which helps bypass content filters and prevents posts from being removed.

## Features

- Create shortened URLs for Instagram CDN images
- Special meta tags optimized for Facebook's crawler
- Random elements to make each post look unique
- Bypasses Facebook's content filters
- Works with Instagram CDN URLs

## How It Works

1. You provide an Instagram CDN URL
2. The application creates a shortened URL
3. When Facebook crawls this URL, it sees special meta tags
4. Facebook processes the image and creates its own CDN link
5. The image appears to be coming directly from Facebook's CDN
6. Regular users who click the link are redirected to the original Instagram image

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
5. Share it on Facebook

## Example

Here's an example of how to use the application:

1. Find an Instagram image URL (must contain cdninstagram.com, fbcdn.net, or scontent)
2. Go to `https://your-vercel-app.vercel.app/create`
3. Enter the URL and click "Create Shortened URL"
4. Share the shortened URL on Facebook

## Notes

- This application only works with Instagram CDN URLs
- The shortened URLs are stored in memory and will be lost when the server restarts (in a production environment, you would use a database)
- The application includes random elements to make each post look unique to Facebook
