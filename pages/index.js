import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const { title = 'Instagram Image', imageUrl } = router.query;
  
  // Default image if none provided
  const defaultImage = 'https://scontent-lax.cdninstagram.com/v/t1.15752-9/483756777_1067305745413222_1271431596689012493_n.png?stp=dst-png_s720x720&_nc_cat=101&ccb=1-7&_nc_sid=0024fc&_nc_ohc=LUc7Oh1AtJcQ7kNvgFGQr77&_nc_oc=AdnikH6JZOcAvmOi_LhYU1_CgpiR221IYuryd3sKgAZBqLt6f8VNbY5Va5GAFEJFqk0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe42-1.fna&oh=03_Q7cD1wHmnUTPWWO98Si1TJa4ugHZkkAN5gB-LazJg-fxaR9vUg&oe=68022012';
  
  // Use provided image URL or default
  const displayImageUrl = imageUrl || defaultImage;
  
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
        <meta name="description" content=""/>
        <meta name="keywords" content=""/>
        <meta name="generator" content="WordPress 5.3.2"/>
        <title>{titleWithEmoji}</title>
        
        <meta property="al:android:package" content="https://www.facebook.com/profile.php/"/>
        <meta name="twitter:app:id:googleplay" content="https://www.facebook.com/profile.php/"/>
        <meta property="al:android:app_name" content="Facebook"/>
        <meta name="twitter:app:name:googleplay" content="Facebook"/>
        <meta name="theme-color" content="#563d7c"/>
        
        {/* Facebook App ID */}
        <meta property="fb:app_id" content="87741124305"/>
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article"/>
        <meta property="og:title" content={titleWithEmoji}/>
        <meta property="og:description" content={description}/>
        
        {/* Image meta tags with direct Instagram CDN URL */}
        {displayImageUrl && (
          <>
            <meta property="og:image" content={displayImageUrl}/>
            <meta property="og:image:type" content="image/jpeg"/>
            <meta property="og:image:width" content="650"/>
            <meta property="og:image:height" content="366"/>
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={displayImageUrl}/>
          </>
        )}
      </Head>

      <div className="container">
        <h1>{titleWithEmoji}</h1>
        {displayImageUrl && (
          <p>
            <Image 
              src={displayImageUrl}
              alt={title}
              width={650}
              height={366}
              layout="responsive"
              className="img-responsive"
            />
          </p>
        )}
      </div>
    </div>
  );
}
