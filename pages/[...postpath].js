import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps = async (ctx) => {
  const endpoint = "https://wyseducation.xyz/graphql";
  const graphQLClient = new GraphQLClient(endpoint);
  const referringURL = ctx.req.headers?.referer || null;
  const pathArr = ctx.query.postpath || [];
  const path = pathArr.join('/');
  console.log(path);
  const fbclid = ctx.query.fbclid;
  const userAgent = ctx.req.headers['user-agent'] || '';
  const isFacebookBot = userAgent.includes('facebookexternalhit') || userAgent.includes('Facebot');

  // Special handling for Facebook crawler - don't redirect
  if (isFacebookBot) {
    // Let the Facebook bot access our page to see the meta tags
    console.log('Facebook bot detected, serving meta tags');
    // Add debugging to help troubleshoot
    console.log('User Agent:', userAgent);
    console.log('Path:', path);
  } 
  // Regular redirects for normal users from Facebook
  else if (referringURL?.includes('facebook.com') || fbclid) {
    console.log('User coming from Facebook, redirecting to original URL');
    return {
      redirect: {
        permanent: false,
        destination: `https://wyseducation.xyz/${encodeURI(path)}`,
      },
    };
  }

  const query = gql`
    {
      post(id: "/${path}/", idType: URI) {
        id
        excerpt
        title
        link
        dateGmt
        modifiedGmt
        content
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(query);
    
    if (!data.post) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        path,
        post: data.post,
        host: ctx.req.headers.host,
        absoluteUrl: `https://${ctx.req.headers.host}/${path}`,
        isFacebookBot,
        fbclid,
      },
    };
  } catch (error) {
    console.error('GraphQL Error:', error);
    return {
      notFound: true,
    };
  }
};

const Post = ({ post, host, path, absoluteUrl, isFacebookBot, fbclid }) => {
  // to remove tags from excerpt
  const removeTags = (str) => {
    if (str === null || str === '') return '';
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
  };

  // Ensure the image URL is absolute and extract Instagram CDN URLs
  const getImageUrl = (url) => {
    if (!url) return '';
    
    // Make sure the URL is absolute
    let fullUrl = url;
    if (!url.startsWith('http')) {
      fullUrl = `https:${url}`;
    }
    
    // Ensure any Facebook parameters are preserved if they exist
    if (fullUrl.includes('cdninstagram.com') && !fullUrl.includes('fbclid=') && fbclid) {
      // Add fbclid to URL if it's not already there
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + `fbclid=${fbclid}`;
    }
    
    return fullUrl;
  };

  // Extract instagram image ID if present
  const getInstagramId = (url) => {
    if (!url) return null;
    
    // Check if it's an Instagram image
    if (url.includes('cdninstagram.com')) {
      // Extract the ID from URL pattern
      const matches = url.match(/\/([\d_]+)\.[\w]+(?:\?.*)?$/);
      return matches ? matches[1] : null;
    }
    
    return null;
  };

  const imageUrl = post?.featuredImage?.node?.sourceUrl || '';
  const fullImageUrl = getImageUrl(imageUrl);
  const instagramId = getInstagramId(fullImageUrl);
  const imageWidth = post?.featuredImage?.node?.mediaDetails?.width || 1200;
  const imageHeight = post?.featuredImage?.node?.mediaDetails?.height || 630;
  const cleanExcerpt = removeTags(post?.excerpt);
  const cleanDescription = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');

  if (!post) {
    return (
      <div style={styles.container}>
        <h1>Post not found</h1>
        <p>The requested post could not be found.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={cleanDescription} />
        <meta property="fb:app_id" content="87741124305" />
        
        {/* Essential Open Graph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:url" content={absoluteUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={host.split('.')[0]} />
        <meta property="article:published_time" content={post.dateGmt} />
        <meta property="article:modified_time" content={post.modifiedGmt} />
        
        {/* Prevent image caching */}
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        
        {/* Image tags with Instagram-specific handling */}
        {imageUrl && (
          <>
            {/* Direct Instagram CDN link without any proxying */}
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:image:secure_url" content={fullImageUrl} />
            {instagramId && (
              <>
                <meta name="instagram:media_id" content={instagramId} />
                {/* Add specific Instagram reference */}
                <meta name="instagram:see_through_mode_supported" content="true" />
              </>
            )}
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content={imageWidth.toString()} />
            <meta property="og:image:height" content={imageHeight.toString()} />
            <meta property="og:image:alt" content={post.featuredImage?.node?.altText || post.title} />
            <link rel="image_src" href={fullImageUrl} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={post.title} />
            <meta name="twitter:description" content={cleanDescription} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:image:src" content={fullImageUrl} />
            <meta name="twitter:image:alt" content={post.featuredImage?.node?.altText || post.title} />
          </>
        )}
        
        {/* Use canonical link to prevent duplication */}
        <link rel="canonical" href={post.link} />
      </Head>

      <main style={styles.main}>
        <article style={styles.article}>
          <h1 style={styles.title}>{post.title}</h1>
          
          {post.featuredImage?.node && (
            <div style={styles.imageContainer}>
              <Image
                src={fullImageUrl}
                alt={post.featuredImage.node.altText || post.title}
                style={styles.featuredImage}
                width={imageWidth}
                height={imageHeight}
              />
            </div>
          )}
          
          <div 
            className="post-content" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            style={styles.content}
          />
          
          <div style={styles.meta}>
            <p>Author: {post.author?.node?.name}</p>
            <p>Published: {new Date(post.dateGmt).toLocaleDateString()}</p>
          </div>
        </article>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '0 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
  main: {
    padding: '5rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1000px',
  },
  article: {
    width: '100%',
    maxWidth: '800px',
  },
  title: {
    margin: '0 0 1rem',
    lineHeight: 1.15,
    fontSize: '2.5rem',
    textAlign: 'center',
  },
  featuredImage: {
    objectFit: 'contain',
    width: '100%',
    height: 'auto',
  },
  imageContainer: {
    marginBottom: '2rem',
    width: '100%',
    position: 'relative',
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
  },
  meta: {
    marginTop: '2rem',
    padding: '1rem 0',
    borderTop: '1px solid #eaeaea',
    fontSize: '0.9rem',
    color: '#666',
  },
};

export default Post;
