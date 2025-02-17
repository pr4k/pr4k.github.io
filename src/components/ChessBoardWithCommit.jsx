import { useState, useEffect } from 'react'
import ChessBoard from '../scripts/Chess'
import { GithubCommitDetails } from './GithubCommitDetails'
import { CommitList } from './CommitList'
import ChessCommitLink from '/public/media/chess-commit.svg'
import ChessMove from '/public/media/chess-move.svg'
import { timerMessage } from 'node_modules/astro/dist/core/logger/core'
// import '../styles/chess.css'
// import '../styles/global.css'

const DEFAULT_PIPELINE = {
  build_status: {
    build_queued: null,
    build_started: null,
    build_in_progress: null,
    build_completed: null
  },
  deployment_status: {
    deployment_queued: null,
    deployment_started: null,
    deployment_in_progress: null,
    deployment_completed: null
  },
  commit_status: {
    commit_initiated: null,
    commit_completed: null,
    commit_failed: null
  }
}

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
  const [pipeline, setPipeline] = useState(DEFAULT_PIPELINE)
  const [loading, setLoading] = useState(false)

  const getStatus = () => {
    return new Promise((resolve, reject) => {
      fetch('https://chesslogs.azurewebsites.net/api/get_build_status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Status Fetch successful:', data)
          setPipeline((prev) => ({ ...DEFAULT_PIPELINE, ...prev, ...data }))
          resolve(data)
        })
        .catch((error) => {
          console.error('Error Getting Status:', error)
          reject(error)
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
    setPipeline((prev) => {
      console.log('initiated', {
        ...DEFAULT_PIPELINE,
        commit_status: {
          ...(prev?.commit_status ?? {}),
          commit_initiated: new Date().toISOString()
        }
      })
      return {
        ...prev,
        commit_status: {
          ...(prev?.commit_status ?? {}),
          commit_initiated: new Date().toISOString()
        }
      }
    })
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
        setPipeline((prev) => {
          return {
            ...prev,
            commit_status: {
              ...(prev?.commit_status ?? {}),
              commit_completed: new Date().toISOString()
            }
          }
        })
      })
      .catch((error) => {
        console.error('Error committing move:', error)
        setPipeline((prev) => {
          return {
            ...prev,
            commit_status: {
              ...(prev?.commit_status ?? {}),
              commit_failed: new Date().toISOString()
            }
          }
        })
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
    setGithubHandle(
      latestCommit?.sha === commit?.sha ? '' : commit?.githubHandle
    )
    setCommitMessageTemplate(
      latestCommit.sha === commit?.sha ? '' : commit?.customMsg
    )
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
  const isInputDisabled = !(
    pipeline?.deployment_status?.deployment_completed &&
    selectedCommit?.sha === latestCommit?.sha
  )
  console.log(currentFen)
  console.table(pipeline)
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
                disabled={isInputDisabled}
              />
            </div>
            <div class={`github-message ${isShakingMessage ? 'shake' : ''}`}>
              <input
                class="github-textarea"
                maxlength="35"
                placeholder="Describe your move"
                value={commitMessageTemplate}
                onChange={(e) => setCommitMessageTemplate(e.target.value)}
                disabled={isInputDisabled}
              ></input>
            </div>
          </div>
        </div>
      </div>
      <CommitList
        selectedCommit={selectedCommit}
        olderCommits={olderCommits}
        buildStatus={pipeline?.build_status}
        deployStatus={pipeline?.deployment_status}
        commitStatus={pipeline?.commit_status}
        handleCommitClick={handleCommitClick}
      />
    </div>
  )
}
