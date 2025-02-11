import React, { useState } from 'react'
import { Chess, type Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'

interface ChessBoardProps {
  fen?: string // Accept pgn as a prop
  onMove: (newMove: string, newFen: string, isCheckmate: boolean) => {}
  isValid: () => boolean
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fen, onMove, isValid }) => {
  console.log('Fen is', fen)

  const [game, setGame] = useState(() => new Chess(fen)) // Initialize game from pgn string or empty
  const [moveFrom, setMoveFrom] = useState<Square | ''>('')
  const [moveTo, setMoveTo] = useState<Square | null>(null)
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [rightClickedSquares, setRightClickedSquares] = useState<
    Record<string, { backgroundColor: string }> | {}
  >({})
  const [optionSquares, setOptionSquares] = useState<
    Record<string, { background: string; borderRadius: string }> | {}
  >({})

  function safeGameMutate(modify: (game: Chess) => void) {
    setGame((g) => {
      const updatedGame = new Chess(g.fen())
      modify(updatedGame)
      return updatedGame
    })
  }

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true
    })
    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }
    const newSquares: Record<
      string,
      { background: string; borderRadius: string }
    > = {}
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)!.color !== game.get(square)!.color
            ? 'radial-gradient(circle, rgba(240, 0, 0, 0.4) 85%, transparent 25%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      }
    })
    newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' }
    setOptionSquares(newSquares)
    return true
  }

  function onSquareClick(square: Square) {
    if (!isValid()) return
    setRightClickedSquares({})

    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square)
      if (hasMoveOptions) setMoveFrom(square)
      return
    }

    const moves = game.moves({ from: moveFrom, verbose: true })
    const foundMove = moves.find((m) => m.to === square)

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square)
      setMoveFrom(hasMoveOptions ? square : '')
      return
    }

    if (
      (foundMove.piece === 'p' && square[1] === '8') ||
      (foundMove.piece === 'p' && square[1] === '1')
    ) {
      setMoveTo(square)
      setShowPromotionDialog(true)
      return
    }

    safeGameMutate((game) => {
      const move = game.move({ from: moveFrom, to: square, promotion: 'q' })
      if (!move) {
        console.error('Invalid move', { from: moveFrom, to: square })
        return
      }
      const pgn = game.pgn().split('\n')
      const tempfen = game.fen()
      const tempMove = pgn.length === 1 ? pgn[0] : pgn[3]

      console.log('fen', tempfen, 'move', tempMove, 'pgn', pgn)
      onMove(tempMove, tempfen, game.isCheckmate())
      if (game.isCheckmate()) {
        console.log('Checkmate')
      }
    })
    setMoveFrom('')
    setMoveTo(null)
    setOptionSquares({})
  }

  function onPromotionPieceSelect(piece: string) {
    if (piece && moveTo) {
      safeGameMutate((game) => {
        const move = game.move({
          from: moveFrom,
          to: moveTo,
          promotion: piece[1].toLowerCase()
        })
        if (!move) {
          console.error('Invalid promotion move', {
            from: moveFrom,
            to: moveTo,
            promotion: piece[1].toLowerCase()
          })
        }
      })
    }
    setMoveFrom('')
    setMoveTo(null)
    setShowPromotionDialog(false)
    setOptionSquares({})
    const pgn = game.pgn().split('\n')
    console.log('Length', pgn.length)
    const tempfen = game.fen()
    const tempMove = pgn.length === 1 ? pgn[0] : pgn[3]

    onMove(tempMove, tempfen, game.isCheckmate())
  }

  function onSquareRightClick(square: Square) {
    const colour = 'rgba(0, 0, 255, 0.4)'
    setRightClickedSquares((prev) => ({
      ...prev,
      [square]:
        prev[square] && prev[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    }))
  }

  return (
    <div>
      <Chessboard
        id="ClickToMove"
        animationDuration={200}
        arePiecesDraggable={false}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
        }}
        customSquareStyles={{ ...optionSquares, ...rightClickedSquares }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
      />
    </div>
  )
}

export default ChessBoard
