import React, { useState } from 'react'

const ChatBox: React.FC = () => {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestedQueries, setSuggestedQueries] = useState([
    'Education background',
    'Key achievements',
    'His skills',
    'Does he like bike?'
  ])

  const handleSend = async (queryText?: string) => {
    const finalQuery = queryText || query
    if (!finalQuery.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        'https://genaiportfolio.azurewebsites.net/api/get_genai_output',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: finalQuery })
        }
      )
      const data = await res.json() // Expecting raw HTML response
      setResponse(data.response)
    } catch (error) {
      console.error('Error fetching response:', error)
    } finally {
      setLoading(false)
      setQuery('')
    }
  }

  return (
    <div className="ai-container">
      <div className="ai-content-box">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : response ? (
          <div dangerouslySetInnerHTML={{ __html: response }} />
        ) : (
          <div className="ai-suggested-questions-grid">
            {suggestedQueries.map((q, index) => (
              <div
                key={index}
                className="ai-suggested-question-bubble"
                onClick={() => {
                  setQuery(q)
                  handleSend(q)
                }}
              >
                {q}
              </div>
            ))}
          </div>
        )}
      </div>
      {response ? (
        <div className="ai-suggested-questions-row">
          {suggestedQueries.map((q, index) => (
            <div
              key={index}
              className="ai-suggested-question-bubble"
              onClick={() => {
                setQuery(q)
                handleSend(q)
              }}
            >
              {q}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      <div className="ai-content-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about me..."
          className="flex-1"
        />
        <button onClick={() => handleSend()} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default ChatBox
