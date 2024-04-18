import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import luffyImage from '../images/naruto.png';
import kaidoImage from '../images/orochi.png';
import narutoWinSound from '../sounds/naruto.mp3';
import orochimaruWinSound from '../sounds/orochi.mp3';

function Square({ value, onSquareClick }) {
  return (
    <button className="square flex justify-center items-center w-20 h-20 bg-orange-500 rounded-md shadow-md border-2 border-orange-600" onClick={onSquareClick}>
      {value === 'Naruto' && <img src={luffyImage} alt="Naruto" className="w-16 h-16 object-cover rounded-md" />}
      {value === 'Orochimaru' && <img src={kaidoImage} alt="Orochimaru" className="w-16 h-16 object-cover rounded-md" />}
    </button>
  );
}

Square.propTypes = {
  value: PropTypes.string.isRequired,
  onSquareClick: PropTypes.func.isRequired
};

function Board({ squares, onPlay }) {
  function handleClick(i) {
    onPlay(i);
  }

  return (
    <div className="board grid grid-cols-3 gap-4">
      {squares.map((value, index) => (
        <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
      ))}
    </div>
  );
}

Board.propTypes = {
  squares: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired
};

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const audioRef = useRef(null);
  const [setIsMusicPlaying] = useState(false);
  const [winner, setWinner] = useState(null);

  function handlePlay(squareIndex) {
    if (isGameFinished || history[currentMove][squareIndex]) {
      return;
    }

    const nextSquares = history[currentMove].slice();
    nextSquares[squareIndex] = currentMove % 2 === 0 ? 'Naruto' : 'Orochimaru';

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      setIsGameFinished(true);
      setWinner(winner);
      playWinSound(winner);
    } else {
      setIsGameFinished(false);
      setWinner(null);
    }
  }

  function playWinSound(winner) {
    const audio = winner === 'Naruto' ? new Audio(narutoWinSound) : new Audio(orochimaruWinSound);
    audio.volume = 0.5;
    audio.play();
    audioRef.current = audio;
    setIsMusicPlaying(true);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setIsGameFinished(false);
    setWinner(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  }

  return (
    <div className="game bg-naruto-background min-h-screen flex flex-col justify-center items-center text-black font-naruto-font">
      <div className="game-board mx-auto">
        <Board squares={history[currentMove]} onPlay={handlePlay} />
      </div>
      <div className="game-info mt-4">
        {winner ? (
          <div>
            <div className="status text-center font-bold mb-4">{winner} a gagné</div>
            <button onClick={handleRestart} className="text-black bg-orange-500 px-3 py-1 rounded-md">Rejouer</button>
          </div>
        ) : (
          <div className="status text-center font-bold mb-4">Prochain tour : {currentMove % 2 === 0 ? 'Naruto' : 'Orochimaru'}</div>
        )}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
