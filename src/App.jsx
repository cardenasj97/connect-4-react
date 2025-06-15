import { useState, useCallback } from 'react'
import './App.css'

const ROWS = 6
const COLS = 7
const EMPTY = 0
const PLAYER1 = 1
const PLAYER2 = 2

function App() {
  const [board, setBoard] = useState(() => 
    Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY))
  )
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1)
  const [winner, setWinner] = useState(null)
  const [winningCells, setWinningCells] = useState([])

  const checkWinner = useCallback((board, row, col, player) => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal /
      [1, -1]   // diagonal \
    ]

    for (let [dx, dy] of directions) {
      let count = 1
      let cells = [[row, col]]
      
      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
            board[newRow][newCol] === player) {
          count++
          cells.push([newRow, newCol])
        } else break
      }
      
      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
            board[newRow][newCol] === player) {
          count++
          cells.push([newRow, newCol])
        } else break
      }
      
      if (count >= 4) {
        return cells
      }
    }
    return null
  }, [])

  const dropPiece = useCallback((col) => {
    if (winner) return

    // Find lowest empty row in column
    let row = -1
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === EMPTY) {
        row = r
        break
      }
    }

    if (row === -1) return // Column full

    const newBoard = board.map(row => [...row])
    newBoard[row][col] = currentPlayer

    const winCells = checkWinner(newBoard, row, col, currentPlayer)
    if (winCells) {
      setWinner(currentPlayer)
      setWinningCells(winCells)
    }

    setBoard(newBoard)
    setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1)
  }, [board, currentPlayer, winner, checkWinner])

  const resetGame = () => {
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)))
    setCurrentPlayer(PLAYER1)
    setWinner(null)
    setWinningCells([])
  }

  const isWinningCell = (row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col)
  }

  return (
    <div className="app">
      <h1>Connect 4</h1>
      
      <div className="game-info">
        {winner ? (
          <div className="winner">
            🎉 Player {winner} Wins! 🎉
          </div>
        ) : (
          <div className="current-player">
            Current Player: <span className={`player-${currentPlayer}`}>
              Player {currentPlayer}
            </span>
          </div>
        )}
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
      </div>

      <div className="board">
        {/* Column headers for dropping pieces */}
        <div className="column-headers">
          {Array(COLS).fill().map((_, col) => (
            <button 
              key={col}
              className="column-btn"
              onClick={() => dropPiece(col)}
              disabled={winner}
            >
              ↓
            </button>
          ))}
        </div>

        {/* Game board */}
        <div className="grid">
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${
                  cell === PLAYER1 ? 'player1' : 
                  cell === PLAYER2 ? 'player2' : 'empty'
                } ${isWinningCell(rowIndex, colIndex) ? 'winning' : ''}`}
              >
                {cell !== EMPTY && (
                  <div className="piece"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
