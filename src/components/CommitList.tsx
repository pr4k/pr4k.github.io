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
  buildStatus: string
  olderCommits: Commit[]
  handleCommitClick: (commit: Commit) => void
}

export const CommitList = ({
  buildStatus,
  selectedCommit,
  olderCommits,
  handleCommitClick
}: Props) => {
  if (buildStatus === 'completed') {
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
  } else if (buildStatus === 'queued') {
    return <h1>Commiting your change</h1>
  } else if (buildStatus == 'in_progress') {
    return <h1>Building your Commit</h1>
  } else {
    return <h1>{buildStatus}</h1>
  }
}
