import React, { useState } from 'react';
import Battle from './components/Battle';
import { Gamepad2, Trophy, Skull } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState('start'); // start, battle, won, lost
  const [winnerName, setWinnerName] = useState('');

  const handleGameEnd = (playerWon, winner) => {
    setWinnerName(winner);
    setGameState(playerWon ? 'won' : 'lost');
  };

  const resetGame = () => {
    setGameState('battle');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans selection:bg-blue-500 selection:text-white">
      
      {gameState === 'start' && (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
             <Gamepad2 size={80} className="relative mx-auto text-white mb-4" />
          </div>
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            宝可梦对战
          </h1>
          <p className="text-gray-400 text-xl">复古网页版</p>
          <button 
            onClick={() => setGameState('battle')}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 hover:scale-110"
          >
            开始对战
            <div className="absolute -inset-3 rounded-xl bg-blue-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
          </button>
        </div>
      )}

      {gameState === 'battle' && (
        <Battle onGameEnd={handleGameEnd} />
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <div className="text-center bg-gray-800 p-12 rounded-3xl border border-gray-700 shadow-2xl max-w-md w-full mx-4">
          {gameState === 'won' ? (
            <Trophy size={80} className="mx-auto text-yellow-400 mb-6 animate-bounce" />
          ) : (
            <Skull size={80} className="mx-auto text-red-500 mb-6 animate-pulse" />
          )}
          
          <h2 className="text-4xl font-bold mb-2">
            {gameState === 'won' ? '胜利！' : '失败'}
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            {gameState === 'won' 
              ? `你和 ${winnerName} 获得了胜利！` 
              : `胜者：${winnerName}`}
          </p>
          
          <button 
            onClick={resetGame}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95
              ${gameState === 'won' ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-red-600 hover:bg-red-500 text-white'}
            `}
          >
            再玩一次
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
