import React, { useState } from 'react'
const ChatBox: React.FC = () => {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        'https://genaiportfolio.azurewebsites.net/api/get_genai_output',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        }
      )
      const data = await res.json() // Expecting raw HTML response
      setResponse(data.response)
    } catch (error) {
      console.error('Error fetching response:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-container">
      <div className="ai-content-box">
        {/* <div dangerouslySetInnerHTML={{ __html: response }} /> */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
        <div>  <img src="https://raw.githubusercontent.com/pr4k/pr4k.github.io/refs/heads/sourcev2/src/images/hero-profile.png" alt="Prakhar Kaushik's Profile Picture">  <h1>Prakhar Kaushik</h1>  <h2>Head of Products & Technology at Polynomial AI</h2>  <p>    <strong>B.Tech in Computer Science, IIIT Bhubaneswar</strong>. Over 4 years of industry experience.    Expert in <strong>AI/ML, DevOps, and Cloud Platforms</strong>. Passionate about building innovative products.  </p>  <p>    <strong>Achievements:</strong> IBM ML Hackathon Winner, Awarded Employee of the year.  </p>  <p>  </p>  <div>    <h2>Find Me At</h2>    <button><a href="https://github.com/pr4k">GitHub</a></button>    <button><a href="https://linkedin.com/in/pr4k">LinkedIn</a></button>    <button><a href="https://medium.com/@pr4k">Medium</a></button>  </div></div>
                `
          }}
        />
      </div>
      <div className="ai-content-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your query..."
          className="flex-1"
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default ChatBox
