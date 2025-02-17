import { GithubCommitDetails } from './GithubCommitDetails'

type Commit = {
  sha: string
  customMsg: string
  date: string
  move: string
  githubHandle: string
  profileImage: string
}

interface Props {
  selectedCommit: Commit
  buildStatus: BuildStatus
  deployStatus: DeployStatus
  commitStatus: CommitStatus
  olderCommits: Commit[]
  handleCommitClick: (commit: Commit) => void
}
interface BuildStatus {
  build_queued: string
  build_started: string
  build_in_progress: string
  build_completed: string
}

interface DeployStatus {
  deployment_queued: string
  deployment_started: string
  deployment_in_progress: string
  deployment_completed: string
}

interface CommitStatus {
  commit_initiated: string
  commit_completed: string
  commit_failed: string
}

interface PipelineProgressTrackerProps {
  title: string
  state: string
  timestamp: string
  endnode: boolean
}

import { useState, useEffect } from 'react'

const PipelineProgressTracker = ({
  title,
  state,
  timestamp,
  endnode
}: PipelineProgressTrackerProps) => {
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      window.location.reload()
    }
  }, [countdown])

  const startCountdown = () => {
    setCountdown(5)
  }

  return (
    <div className="progress-object">
      <div className="progress-card">
        <div className={`circular-indicator ${state}`}>
          <div className={state}></div>
        </div>
        <div className="progress-title-card">
          {endnode && state === 'completed' ? (
            <button className="title refresh-button" onClick={startCountdown}>
              {countdown !== null ? `Refreshing in ${countdown}...` : title}
            </button>
          ) : (
            <p className="title">{title}</p>
          )}
          <p className="subtitle">{timestamp}</p>
        </div>
      </div>
      {!endnode && <div className={`progress-connector ${state}`}></div>}
    </div>
  )
}

export const CommitList = ({
  buildStatus,
  deployStatus,
  commitStatus,
  selectedCommit,
  olderCommits,
  handleCommitClick
}: Props) => {
  const getTitleAndState = (
    type: 'commit' | 'build' | 'deploy',
    status: CommitStatus | BuildStatus | DeployStatus
  ) => {
    if (type === 'commit' && 'commit_initiated' in status) {
      return {
        title: status.commit_initiated
          ? status.commit_completed
            ? 'Commit Completed'
            : 'Commit In Progress'
          : 'Commit Initiated',
        state: status.commit_initiated
          ? status.commit_completed
            ? 'completed'
            : 'in_progress'
          : 'initiated',
        timestamp: ''
      }
    } else if (type === 'build' && 'build_queued' in status) {
      return {
        title: status.build_completed
          ? 'Build Completed'
          : status.build_in_progress
            ? 'Build In Progress'
            : status.build_started
              ? 'Build Started'
              : 'Build Initiated',
        state: status.build_completed
          ? 'completed'
          : status.build_in_progress
            ? 'in_progress'
            : status.build_started
              ? 'initiated'
              : 'queued',
        timestamp: status.build_completed
          ? status.build_completed
          : status.build_in_progress
            ? status.build_in_progress
            : status.build_started
              ? status.build_started
              : status.build_queued
      }
    } else if (type === 'deploy' && 'deployment_queued' in status) {
      return {
        title: status.deployment_completed
          ? 'Deployment Completed'
          : status.deployment_in_progress
            ? 'Deployment In Progress'
            : status.deployment_started
              ? 'Deployment Started'
              : 'Deployment Initiated',
        state: status.deployment_completed
          ? 'completed'
          : status.deployment_in_progress
            ? 'in_progress'
            : status.deployment_started
              ? 'initiated'
              : 'queued',
        timestamp: status.deployment_completed
          ? status.deployment_completed
          : status.deployment_in_progress
            ? status.deployment_in_progress
            : status.deployment_started
              ? status.deployment_started
              : status.deployment_queued
      }
    }

    return { title: '', state: '', timestamp: '' }
  }

  const commitProgressProps = getTitleAndState('commit', commitStatus)
  const buildProgressProps = getTitleAndState('build', buildStatus)
  const deployProgressProps = getTitleAndState('deploy', deployStatus)
  if (deployStatus.deployment_completed && !commitStatus.commit_initiated) {
    return (
      <div className="commit-info">
        {selectedCommit ? (
          <>
            <h3>Latest Github Commit</h3>

            <GithubCommitDetails
              commit={selectedCommit}
              onClick={() => {
                console.log('On Click worked')
              }}
            />

            <h3>Older Commits</h3>
            <div className="commit-list">
              {olderCommits.length > 0 ? (
                olderCommits.map((commit) => (
                  <GithubCommitDetails
                    key={commit.sha}
                    commit={commit}
                    onClick={() => {
                      handleCommitClick(commit)
                    }}
                  />
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
    )
  } else {
    return (
      <div className="pipeline-list">
        <PipelineProgressTracker {...commitProgressProps} endnode={false} />
        <PipelineProgressTracker {...buildProgressProps} endnode={false} />
        <PipelineProgressTracker {...deployProgressProps} endnode={false} />
        <PipelineProgressTracker
          title="Waiting to deploy"
          timestamp={deployStatus.deployment_completed}
          state={deployStatus.deployment_completed ? 'completed' : 'initiated'}
          endnode={deployStatus.deployment_completed ? true : false}
        />
      </div>
    )
  }
}
