import { GetServerSideProps } from "next"
import { getPostsV2 } from "../apis/notion-client/getPostsV2"

interface TestPageProps {
  posts: any[]
  error?: string
}

const TestNotionPage = ({ posts, error }: TestPageProps) => {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Notion API v2025-09-03 Test</h1>
      
      {error && (
        <div style={{ 
          background: "#fee", 
          padding: "1rem", 
          borderRadius: "4px", 
          marginBottom: "1rem",
          border: "1px solid #fcc"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <strong>Posts found:</strong> {posts.length}
      </div>

      {posts.length > 0 ? (
        <div>
          <h2>Posts:</h2>
          {posts.map((post, index) => (
            <div 
              key={post.id || index}
              style={{ 
                border: "1px solid #ddd", 
                padding: "1rem", 
                marginBottom: "1rem",
                borderRadius: "4px"
              }}
            >
              <h3>{post.title}</h3>
              <p><strong>ID:</strong> {post.id}</p>
              <p><strong>Created:</strong> {new Date(post.createdTime).toLocaleString()}</p>
              <p><strong>Last Edited:</strong> {new Date(post.lastEditedTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          background: "#f9f9f9", 
          padding: "1rem", 
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}>
          No posts found. Check console for detailed logs.
        </div>
      )}

      <div style={{ marginTop: "2rem", fontSize: "0.9em", color: "#666" }}>
        <p>Check browser console and Vercel function logs for detailed information.</p>
        <p>Environment variables needed:</p>
        <ul>
          <li>NOTION_PAGE_ID (already set)</li>
          <li>NOTION_TOKEN (needs to be set)</li>
        </ul>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const posts = await getPostsV2()
    return {
      props: {
        posts,
      },
    }
  } catch (error) {
    console.error("Server-side error:", error)
    return {
      props: {
        posts: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }
  }
}

export default TestNotionPage
