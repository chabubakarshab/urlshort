import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function ShortUrl() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urlData, setUrlData] = useState(null);
  
  useEffect(() => {
    if (!id) return;
    
    // Check if this is a bot/crawler
    const userAgent = navigator.userAgent;
    const isCrawler = (
      userAgent.includes('facebookexternalhit') ||
      userAgent.includes('Facebot') ||
      userAgent.includes('WhatsApp') ||
      userAgent.includes('Twitterbot') ||
      userAgent.includes('LinkedInBot') ||
      userAgent.includes('TelegramBot') ||
      userAgent.includes('bot') ||
      userAgent.includes('crawler') ||
      userAgent.includes('spider')
    );
    
    // Fetch the URL data from our API
    fetch(`/api/url/${id}`)
      .then(response => response.json())
      .then(result => {
        if (!result.success) {
          throw new Error(result.error || 'URL not found');
        }
        
        setUrlData(result.data);
        setLoading(false);
        
        // If it's not a crawler, redirect to the original URL
        if (!isCrawler) {
          window.location.href = result.data.originalUrl;
        }
      })
      .catch(err => {
        console.error('Error fetching URL data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);
  
  if (loading) {
    return (
      <div className="container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      }}>
        <h1>Loading...</h1>
      </div>
    );
  }
  
  if (error || !urlData) {
    return (
      <div className="container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      }}>
        <h1>Error: {error || 'URL not found'}</h1>
        <p>
          <Link href="/create">
            <a style={{
              color: '#0070f3',
              textDecoration: 'none',
              fontWeight: 500,
            }}>Create a new shortened URL</a>
          </Link>
        </p>
      </div>
    );
  }
  
  const { originalUrl, title = 'Instagram Image', views = 0 } = urlData;
  
  // Add emojis to title
  const emojis = ["😱", "😲", "😮", "🔥", "⚡", "✨", "💥", "👀"];
  const randomEmojiIndex1 = Math.floor(Math.random() * emojis.length);
  const randomEmojiIndex2 = Math.floor(Math.random() * emojis.length);
  const titleWithEmoji = `${emojis[randomEmojiIndex1]}${title}${emojis[randomEmojiIndex2]}`;
  
  return (
    <div>
      <Head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="description" content={`View ${title} - Viewed ${views} times`}/>
        <meta name="keywords" content="instagram,image,photo"/>
        <title>{titleWithEmoji}</title>
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article"/>
        <meta property="og:title" content={titleWithEmoji}/>
        <meta property="og:description" content={`View ${title} - Viewed ${views} times`}/>
        <meta property="og:image" content={originalUrl}/>
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:width" content="650"/>
        <meta property="og:image:height" content="366"/>
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={titleWithEmoji}/>
        <meta name="twitter:description" content={`View ${title} - Viewed ${views} times`}/>
        <meta name="twitter:image" content={originalUrl}/>
      </Head>

      <div className="container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}>{titleWithEmoji}</h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '2rem',
        }}>Viewed {views} times</p>
        <div style={{
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <Image 
            src={originalUrl}
            alt={title}
            width={650}
            height={366}
            layout="responsive"
            className="img-responsive"
            unoptimized={true}
          />
        </div>
        <p style={{
          textAlign: 'center',
          marginTop: '2rem',
        }}>
          <Link href="/create">
            <a style={{
              color: '#0070f3',
              textDecoration: 'none',
              fontWeight: 500,
            }}>Create your own shortened URL</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
