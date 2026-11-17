
import React, { useState } from "react";
import "./app.css";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }

  return null;
}

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${value ? `mark-${value.toLowerCase()}` : ""} ${
        isWinning ? "winning" : ""
      }`}
      onClick={onSquareClick}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value && <span className="mark">{value}</span>}
    </button>
  );
}

function Board({ squares, onPlay, winningLine }) {
  return (
    <div className="board">
      {squares.map((square, index) => (
        <Square
          key={index}
          value={square}
          isWinning={winningLine?.includes(index)}
          onSquareClick={() => onPlay(index)}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), position: null }
  ]);

  const [currentMove, setCurrentMove] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const currentHistory = history[currentMove];
  const squares = currentHistory.squares;
  const xIsNext = currentMove % 2 === 0;

  const result = calculateWinner(squares);
  const isDraw = !result && squares.every(Boolean);
  const gameOver = !!result || isDraw;

  function handlePlay(index) {
    if (squares[index] || gameOver) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";

    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, position: index }
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const nextResult = calculateWinner(nextSquares);

    if (nextResult) {
      setScores(prev => ({
        ...prev,
        [nextResult.winner]: prev[nextResult.winner] + 1
      }));
    } else if (nextSquares.every(Boolean)) {
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    }
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function newGame() {
    setHistory([
      { squares: Array(9).fill(null), position: null }
    ]);
    setCurrentMove(0);
  }

  function resetAll() {
    newGame();
    setScores({ X: 0, O: 0, draws: 0 });
  }

  const status = result
    ? `Player ${result.winner} wins!`
    : isDraw
    ? "It's a draw!"
    : `Player ${xIsNext ? "X" : "O"}'s turn`;

  return (
    <main className="game-page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <div className="game-layout">
        <header className="header">
          <div className="logo">XO<span>.</span></div>
          <div className="header-label">CLASSIC GAME</div>
        </header>

        <section className="game-content">
          <div className="game-intro">
            <span className="eyebrow">THE ULTIMATE DUEL</span>
            <h1>Tic Tac <span>Toe</span></h1>
            <p>Three in a row. One winner. Let the game begin.</p>
          </div>

          <div className="game-panel">
            <div className="scoreboard">
              <div className={`player-card ${!gameOver && xIsNext ? "active-x" : ""}`}>
                <span className="player-label">PLAYER 01</span>
                <span className="player-symbol x-color">X</span>
                <span className="player-name">Player X</span>
                <strong>{scores.X}</strong>
              </div>

              <div className="versus">VS</div>

              <div className={`player-card ${!gameOver && !xIsNext ? "active-o" : ""}`}>
                <span className="player-label">PLAYER 02</span>
                <span className="player-symbol o-color">O</span>
                <span className="player-name">Player O</span>
                <strong>{scores.O}</strong>
              </div>
            </div>

            <div className={`game-status ${result ? "winner-status" : ""}`}>
              <span className={`status-dot ${gameOver ? "finished" : ""}`} />
              <span>{status}</span>
              {result && <span className="trophy">🏆</span>}
              {isDraw && <span>🤝</span>}
            </div>

            <Board
              squares={squares}
              onPlay={handlePlay}
              winningLine={result?.line}
            />

            <div className="game-actions">
              <button className="primary-btn" onClick={newGame}>
                <span>↻</span> New Game
              </button>
              <button className="secondary-btn" onClick={resetAll}>
                Reset All
              </button>
            </div>

            <div className="draw-score">
              <span>DRAWS</span>
              <strong>{scores.draws}</strong>
            </div>
          </div>

          <section className="history-panel">
            <div className="history-heading">
              <h2>Game History</h2>
              <span>{history.length - 1} MOVES</span>
            </div>

            <div className="history-list">
              {history.map((move, index) => (
                <button
                  key={index}
                  onClick={() => jumpTo(index)}
                  className={`history-item ${
                    currentMove === index ? "selected" : ""
                  }`}
                >
                  <span className="move-number">
                    {index === 0 ? "00" : String(index).padStart(2, "0")}
                  </span>
                  <span>
                    {index === 0
                      ? "Game Start"
                      : `Move ${index} · ${
                          index % 2 === 1 ? "Player X" : "Player O"
                        }`}
                  </span>
                  {currentMove === index && (
                    <span className="current-tag">CURRENT</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </section>

        <footer>
          BUILT WITH REACT <span>•</span> TWO PLAYER MODE
        </footer>
      </div>
    </main>
  );
}
