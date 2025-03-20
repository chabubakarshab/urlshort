import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { GraphQLClient, gql } from 'graphql-request';

export async function getStaticProps() {
  const endpoint = "https://wyseducation.xyz/graphql";
  const graphQLClient = new GraphQLClient(endpoint);
  
  const query = gql`
    {
      posts(first: 10) {
        nodes {
          id
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(query);
    return {
      props: {
        posts: data.posts.nodes,
      },
      revalidate: 60, // Re-generate the page every 60 seconds if needed
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        posts: [],
      },
      revalidate: 60,
    };
  }
}

export default function Home({ posts }) {
  const [showCreateButton, setShowCreateButton] = useState(false);

  useEffect(() => {
    // Show the create button after the page loads instead of redirecting
    setShowCreateButton(true);
  }, []);
  
  // Helper function to remove HTML tags from excerpt
  const removeTags = (str) => {
    if (str === null || str === '') return '';
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>WordPress Posts | URL Shortener</title>
        <meta name="description" content="View WordPress posts and create shortened URLs" />
      </Head>
      
      <main style={styles.main}>
        <h1 style={styles.title}>WordPress Posts</h1>
        
        {showCreateButton && (
          <Link href="/create" style={styles.createLink}>
            <div style={styles.createButton}>
              Create Shortened URL
            </div>
          </Link>
        )}

        {posts && posts.length > 0 ? (
          <div style={styles.postsGrid}>
            {posts.map((post) => (
              <Link 
                href={`/${post.slug}`} 
                key={post.id}
                style={styles.postCard}
              >
                <div>
                  {post.featuredImage?.node && (
                    <div style={styles.imageContainer}>
                      <img 
                        src={post.featuredImage.node.sourceUrl} 
                        alt={post.featuredImage.node.altText || post.title}
                        style={styles.postImage}
                      />
                    </div>
                  )}
                  <h2 style={styles.postTitle}>{post.title}</h2>
                  <div style={styles.postExcerpt}>{removeTags(post.excerpt)}</div>
                  <p style={styles.postDate}>
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={styles.noPostsMessage}>No posts found. Check back later!</p>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '0 0.5rem',
    display: 'flex',
    flexDirection: 'column',
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
    maxWidth: '1200px',
  },
  title: {
    margin: '0 0 2rem 0',
    lineHeight: 1.15,
    fontSize: '2.5rem',
    textAlign: 'center',
    color: '#333',
  },
  createLink: {
    textDecoration: 'none',
    marginBottom: '2rem',
  },
  createButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#0070f3',
    color: 'white',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    width: '100%',
  },
  postCard: {
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    padding: '1.5rem',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'color 0.15s ease, border-color 0.15s ease, transform 0.2s ease',
    cursor: 'pointer',
    transform: 'translateY(0)',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    borderRadius: '5px',
    marginBottom: '1rem',
  },
  postImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  postTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.5rem',
    color: '#0070f3',
  },
  postExcerpt: {
    margin: '0',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#666',
  },
  postDate: {
    fontSize: '0.8rem',
    color: '#999',
    marginTop: '1rem',
  },
  noPostsMessage: {
    color: '#666',
    fontSize: '1.2rem',
    textAlign: 'center',
  },
};
