import ChessCommitLink from '/public/media/chess-commit.svg'
import ChessMove from '/public/media/chess-move.svg'
import Avatar from './Avatar'

interface Props {
  commit: {
    sha: string
    customMsg: string
    date: string
    move: string
    githubHandle: string
    profileImage: string
  }
  onClick: () => void
}

export const GithubCommitDetails = ({ commit, onClick }: Props) => {
  return (
    <div className="commit-info-card" onClick={onClick}>
      {commit.profileImage ? (
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
      ) : (
        <div className="section-heading">
          <Avatar name={commit.githubHandle} bgColor="#343841" />
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
        <a href={`https://github.com/pr4k/ChessLogs/commit/${commit.sha}`}>
          <p className="github-commit-link">
            <span className="ellipsis">{`https://github.com/pr4k/ChessLogs/commit/${commit.sha}`}</span>
            <span className="indent">{`https://github.com/pr4k/ChessLogs/commit/${commit.sha}`}</span>
          </p>
        </a>
      </div>
    </div>
  )
}
