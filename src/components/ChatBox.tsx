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
            __html: ` <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">        <img src="https://pr4k.me/img" alt="Prakhar Kaushik" style="width: 150px; border-radius: 50%;">        <h1>Prakhar Kaushik</h1>        <p style="text-align: center;">FREELANCER | FREELANCE DEVELOPER</p>        <p style="text-align: center;">Completed more than 150 projects with multiple rated projects.</p>        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Contact Me</button>    </div>`
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
