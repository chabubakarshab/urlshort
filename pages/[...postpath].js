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

  // redirect if facebook is the referer or request contains fbclid
  if (referringURL?.includes('facebook.com') || fbclid) {
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
      },
    };
  } catch (error) {
    console.error('GraphQL Error:', error);
    return {
      notFound: true,
    };
  }
};

const Post = ({ post, host, path, absoluteUrl }) => {
  // to remove tags from excerpt
  const removeTags = (str) => {
    if (str === null || str === '') return '';
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
  };

  // Format image URL to ensure it's absolute
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https:${url}`;
  };

  const imageUrl = post?.featuredImage?.node?.sourceUrl || '';
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
        
        {/* Image tags with conditional rendering and improved format */}
        {imageUrl && (
          <>
            <meta property="og:image" content={getImageUrl(imageUrl)} />
            <meta property="og:image:secure_url" content={getImageUrl(imageUrl)} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content={imageWidth.toString()} />
            <meta property="og:image:height" content={imageHeight.toString()} />
            <meta property="og:image:alt" content={post.featuredImage?.node?.altText || post.title} />
            <link rel="image_src" href={getImageUrl(imageUrl)} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={post.title} />
            <meta name="twitter:description" content={cleanDescription} />
            <meta name="twitter:image" content={getImageUrl(imageUrl)} />
            <meta name="twitter:image:alt" content={post.featuredImage?.node?.altText || post.title} />
          </>
        )}
      </Head>

      <main style={styles.main}>
        <article style={styles.article}>
          <h1 style={styles.title}>{post.title}</h1>
          
          {post.featuredImage?.node && (
            <div style={styles.imageContainer}>
              <Image
                src={getImageUrl(post.featuredImage.node.sourceUrl)}
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
    margin: '0 0 1rem 0',
    lineHeight: 1.15,
    fontSize: '2.5rem',
    textAlign: 'left',
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    marginBottom: '2rem',
  },
  featuredImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#444',
  },
  meta: {
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eaeaea',
    fontSize: '0.9rem',
    color: '#666',
  },
};

export default Post;
