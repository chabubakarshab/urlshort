import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function ShortUrl() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [urlData, setUrlData] = useState(null);
  
  // Fetch the URL data from our API
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
    
    // For demo purposes, handle the demo1 shortcode directly
    if (id === 'demo1') {
      setUrlData({
        originalUrl: 'https://scontent-lax.cdninstagram.com/v/t1.15752-9/483756777_1067305745413222_1271431596689012493_n.png?stp=dst-png_s720x720&_nc_cat=101&ccb=1-7&_nc_sid=0024fc',
        title: 'Demo Instagram Image'
      });
      setLoading(false);
      
      // If it's not a crawler, redirect to the original URL
      if (!isCrawler) {
        window.location.href = 'https://scontent-lax.cdninstagram.com/v/t1.15752-9/483756777_1067305745413222_1271431596689012493_n.png?stp=dst-png_s720x720&_nc_cat=101&ccb=1-7&_nc_sid=0024fc';
      }
      return;
    }
    
    // Fetch the URL data from our API
    fetch(`/api/url/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('URL not found');
        }
        return response.json();
      })
      .then(data => {
        setUrlData(data);
        setLoading(false);
        
        // If it's not a crawler, redirect to the original URL
        if (!isCrawler && data.originalUrl) {
          window.location.href = data.originalUrl;
        }
      })
      .catch(err => {
        console.error('Error fetching URL data:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);
  
  // Show loading state
  if (loading) {
    return <div className="container"><h1>Loading...</h1></div>;
  }
  
  // Show error state
  if (error || !urlData) {
    return (
      <div className="container">
        <h1>URL not found</h1>
        <p>
          <Link href="/create">
            <a>Create a new shortened URL</a>
          </Link>
        </p>
      </div>
    );
  }
  
  const { originalUrl, title = 'Instagram Image' } = urlData;
  
  // Add emojis to title
  const emojis = ["😱", "😲", "😮", "🔥", "⚡", "✨", "💥", "👀"];
  const randomEmojiIndex1 = Math.floor(Math.random() * emojis.length);
  const randomEmojiIndex2 = Math.floor(Math.random() * emojis.length);
  const titleWithEmoji = `${emojis[randomEmojiIndex1]}${title}${emojis[randomEmojiIndex2]}`;
  
  // Random description
  const randomDescriptions = [
    "Online Members",
    "Active Users",
    "People Online",
    "Viewers Now",
    "Live Viewers",
    "Current Viewers"
  ];

  const randomNumbers = [
    "1,350,350",
    "2,456,789",
    "3,789,123",
    "1,234,567",
    "987,654",
    "2,345,678"
  ];

  const randomIndex = Math.floor(Math.random() * randomDescriptions.length);
  const randomNumIndex = Math.floor(Math.random() * randomNumbers.length);
  const description = `${randomNumbers[randomNumIndex]} ${randomDescriptions[randomIndex]}`;
  
  return (
    <div>
      <Head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="description" content={description}/>
        <meta name="keywords" content="instagram,image,photo"/>
        <title>{titleWithEmoji}</title>
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article"/>
        <meta property="og:title" content={titleWithEmoji}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={originalUrl}/>
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:width" content="650"/>
        <meta property="og:image:height" content="366"/>
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={titleWithEmoji}/>
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content={originalUrl}/>
      </Head>

      <div className="container">
        <h1>{titleWithEmoji}</h1>
        <p>
          <Image 
            src={originalUrl}
            alt={title}
            width={650}
            height={366}
            layout="responsive"
            className="img-responsive"
            unoptimized={true}
          />
        </p>
      </div>
    </div>
  );
}
