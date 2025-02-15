import { useState, useEffect } from 'react'
import ChessBoard from '../scripts/Chess'
// import '../styles/chess.css'
// import '../styles/global.css'

import ChessMove from '/public/media/chess-move.svg'
import ChessCommitLink from '/public/media/chess-commit.svg'

export default function ChessBoardWithCommits({
  latestCommit,
  olderCommits,
  buildNumber
}) {
  const [currentFen, setCurrentFen] = useState(
    latestCommit?.fen ||
      // 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      '5k2/8/7r/8/8/5q2/K7/4r3 w - - 0 1'
  )
  const [selectedCommit, setSelectedCommit] = useState(latestCommit)

  const [githubHandle, setGithubHandle] = useState('')
  const [commitMessageTemplate, setCommitMessageTemplate] = useState('')
  const [isShakingHandle, setIsShakingHandle] = useState(false)
  const [isShakingMessage, setIsShakingMessage] = useState(false)
  const [buildStatus, setBuildStatus] = useState('completed')
  const [loading, setLoading] = useState(false)

  const getStatus = () => {
    // setLoading(true)
    return new Promise((resolve, reject) => {
      fetch('https://chesslogs.azurewebsites.net/api/get_build_status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Commit successful:', data)
          setBuildStatus(data['status'])
          resolve(data['status'])
        })
        .catch((error) => {
          console.error('Error committing move:', error)
          reject(error)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }
  useEffect(() => {
    let timer
    const poll = () => {
      if (timer) clearTimeout(timer)

      getStatus()
        .then((status) => {
          timer = setTimeout(() => {
            poll()
          }, 5000)
        })
        .catch((e) => {
          if (timer) clearTimeout(timer)
        })
    }
    poll()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  const updateCommit = (requestBody) => {
    fetch('https://chesslogs.azurewebsites.net/api/update_commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Commit successful:', data)
      })
      .catch((error) => {
        console.error('Error committing move:', error)
      })
  }
  const startNewGame = (buildNumber) => {
    const defaultFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const commitMessage = `BuildNo: ${buildNumber} | @pr4k | Game Reset | move = NA | fen = ${defaultFen}`
    const requestBody = {
      new_content: commitMessage,
      commit_message: commitMessage
    }
    console.log(requestBody)
    updateCommit(requestBody)
  }

  const handleNewMove = (newMove, newFen, isCheckmate = false) => {
    const commitMessage = `BuildNo: ${buildNumber} | @${githubHandle} | ${commitMessageTemplate} | move = ${newMove} | fen = ${newFen}`

    const requestBody = {
      new_content: commitMessage,
      commit_message: commitMessage
    }
    console.log(requestBody)
    updateCommit(requestBody)
    if (isCheckmate) {
      const newBuildNo = buildNumber + 1
      startNewGame(newBuildNo)
    }
  }

  const handleCommitClick = (commit) => {
    setCurrentFen(commit.fen)
    setSelectedCommit(commit)
  }

  const isValid = () => {
    let isValidFlag = true

    if (githubHandle.length === 0) {
      isValidFlag = false
      setIsShakingHandle(true)
      setTimeout(() => setIsShakingHandle(false), 500) // Stop shake after animation
    }

    if (commitMessageTemplate.length === 0) {
      isValidFlag = false
      setIsShakingMessage(true)
      setTimeout(() => setIsShakingMessage(false), 500) // Stop shake after animation
    }

    return isValidFlag
  }

  return (
    <div className="container">
      <div className="chessboard">
        <ChessBoard
          key={currentFen}
          fen={currentFen}
          onMove={handleNewMove}
          isValid={isValid}
        />

        <div class="github-container">
          <div class="github-thumbnail">
            <img
              src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
              alt=""
            />
          </div>
          <div class="github-handle-section">
            <div class={`github-handle ${isShakingHandle ? 'shake' : ''}`}>
              {/* <img
                src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                alt=""
              /> */}
              <input
                type="text"
                class="github-input"
                placeholder="Your github handle goes here..."
                maxlength="36"
                value={githubHandle}
                onChange={(e) => setGithubHandle(e.target.value)}
              />
            </div>
            <div class={`github-message ${isShakingMessage ? 'shake' : ''}`}>
              <input
                class="github-textarea"
                maxlength="35"
                placeholder="Describe your move"
                value={commitMessageTemplate}
                onChange={(e) => setCommitMessageTemplate(e.target.value)}
              ></input>
            </div>
          </div>
        </div>
      </div>

      {buildStatus === 'completed' ? (
        // If buildStatus is completed, render this:
        <div className="commit-info">
          {selectedCommit ? (
            <>
              <h3>Latest Github Commit</h3>
              <div className="latest-commit">
                {selectedCommit.profileImage && (
                  <div className="section-heading">
                    <a
                      href={`https://github.com/${selectedCommit.githubHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={selectedCommit.profileImage}
                        alt="Profile"
                        className="profile-img"
                      />
                    </a>
                    <div className="section-title">
                      <h4>{selectedCommit.customMsg}</h4>
                      <span>{selectedCommit.date}</span>
                    </div>
                  </div>
                )}
                <div className="section-commit-info">
                  <div className="img-div">
                    <img src={ChessMove.src} />
                  </div>
                  <p>{selectedCommit.move}</p>
                </div>
                <div className="section-commit-info">
                  <div className="img-div">
                    <img src={ChessCommitLink.src} />
                  </div>
                  <a
                    href={`https://github.com/pr4k/ChessLogs/commit/${selectedCommit.sha}`}
                  >
                    https://github.co...{selectedCommit.sha.slice(-5)}
                  </a>
                </div>
              </div>

              <h3>Older Commits</h3>
              <div className="commit-list">
                {olderCommits.length > 0 ? (
                  olderCommits.map((commit) => (
                    <div key={commit.sha}>
                      {commit.profileImage && (
                        <div className="section-heading">
                          <a
                            href={`https://github.com/${commit.githubHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={commit.profileImage}
                              alt="Profile"
                              className="profile-img"
                            />
                          </a>
                          <div className="section-title">
                            <h4>{commit.customMsg}</h4>
                            <span>{commit.date}</span>
                          </div>
                        </div>
                      )}
                      <div className="section-commit-info">
                        <div className="img-div">
                          <img src={ChessMove.src} />
                        </div>
                        <p>{commit.move}</p>
                      </div>
                      <div className="section-commit-info">
                        <div className="img-div">
                          <img src={ChessCommitLink.src} />
                        </div>
                        <a
                          href={`https://github.com/pr4k/ChessLogs/commit/${commit.sha}`}
                        >
                          https://github.co...{commit.sha.slice(-5)}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No older commits found.</p>
                )}
              </div>
            </>
          ) : (
            <p>Failed to load commit data.</p>
          )}
        </div>
      ) : (
        <h1>{buildStatus}</h1>
      )}
    </div>
  )
}
