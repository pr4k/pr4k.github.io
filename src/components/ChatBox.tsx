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
        <div dangerouslySetInnerHTML={{ __html: response }} />
        {/* <div
          dangerouslySetInnerHTML={{
            __html: `
        <div>            <img src="https://raw.githubusercontent.com/pr4k/pr4k.github.io/refs/heads/sourcev2/src/images/hero-profile.png" alt="Prakhar Kaushik's Profile Picture">            <h1>Prakhar Kaushik</h1>            <h2>Head of Products & Technology at Polynomial AI</h2>            <p>AI/ML enthusiast with 4+ years experience. Building the future with data and code.            <br> Passionate about innovation and open-source contributions.            </p>            <p><strong>To connect with Prakhar on GitHub, find him at:</strong></p>            <ul>                <li>                    <button onclick="window.open('github.com/pr4k', '_blank')">GitHub</button>                </li>                <li>                    <button onclick="window.open('linkedin.com/in/pr4k', '_blank')">LinkedIn</button>                </li>                <li>                    <button onclick="window.open('medium.com/@pr4k', '_blank')">Medium</button>                </li>            </ul>        </div>
            `
          }}
        /> */}
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
