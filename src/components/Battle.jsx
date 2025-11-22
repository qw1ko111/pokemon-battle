import React, { useState, useEffect } from 'react';
import { getRandomPokemonId, fetchPokemon, calculateDamage } from '../utils/api';
import PokemonCard from './PokemonCard';
import { Swords, RefreshCw, Shield, Zap } from 'lucide-react';

const Battle = ({ onGameEnd }) => {
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [playerHp, setPlayerHp] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerAnim, setPlayerAnim] = useState('');
  const [enemyAnim, setEnemyAnim] = useState('');

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    setError(null);
    setBattleLog(['战斗开始！']);
    
    try {
      const pId = getRandomPokemonId();
      let eId = getRandomPokemonId();
      while(eId === pId) eId = getRandomPokemonId();

      const [pData, eData] = await Promise.all([
        fetchPokemon(pId),
        fetchPokemon(eId)
      ]);

      if (pData && eData) {
        setPlayerPokemon(pData);
        setEnemyPokemon(eData);
        setPlayerHp(pData.stats.maxHp);
        setEnemyHp(eData.stats.maxHp);
        setIsPlayerTurn(true);
      } else {
        setError('无法获取宝可梦数据，请检查网络连接。');
      }
    } catch (err) {
      setError('发生错误：' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addLog = (message) => {
    setBattleLog(prev => [message, ...prev].slice(0, 4)); // Keep last 4 logs
  };

  const triggerAnimation = (isPlayerAttacking, moveType, hit) => {
    if (isPlayerAttacking) {
      // Player attacking animation
      const attackAnim = moveType === '一般' ? 'animate-attack-tackle-right' : 'animate-attack-beam-right';
      setPlayerAnim(attackAnim);
      
      // Enemy taking damage animation
      if (hit) {
        setTimeout(() => setEnemyAnim('animate-shake filter brightness-150 sepia-[.5] hue-rotate-[300deg]'), 250);
      }
      
      // Reset
      setTimeout(() => {
        setPlayerAnim('');
        setEnemyAnim('');
      }, 600);
    } else {
      // Enemy attacking animation
      const attackAnim = moveType === '一般' ? 'animate-attack-tackle-left' : 'animate-attack-beam-left';
      setEnemyAnim(attackAnim);

      // Player taking damage animation
      if (hit) {
        setTimeout(() => setPlayerAnim('animate-shake filter brightness-150 sepia-[.5] hue-rotate-[300deg]'), 250);
      }

      // Reset
      setTimeout(() => {
        setPlayerAnim('');
        setEnemyAnim('');
      }, 600);
    }
  };

  const handleTurn = async (moveIndex) => {
    if (!isPlayerTurn) return;

    // Player Move
    const move = playerPokemon.moves[moveIndex];
    const result = calculateDamage(playerPokemon, enemyPokemon, move);
    
    // Trigger Player Animation
    triggerAnimation(true, move.name === '破坏光线' ? 'special' : '一般', result.hit);
    
    if (result.hit) {
      const newHp = Math.max(0, enemyHp - result.damage);
      // Delay damage update slightly to sync with animation hit
      setTimeout(() => setEnemyHp(newHp), 300);
      
      addLog(`你使用了 ${move.name}！造成了 ${result.damage} 点伤害。`);
      
      if (newHp === 0) {
        setTimeout(() => onGameEnd(true, playerPokemon.name), 1000);
        return;
      }
    } else {
      addLog(`你使用了 ${move.name}，但是没有命中！`);
    }

    setIsPlayerTurn(false);

    // Enemy Turn (AI)
    setTimeout(() => {
      const enemyMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
      const enemyResult = calculateDamage(enemyPokemon, playerPokemon, enemyMove);

      // Trigger Enemy Animation
      triggerAnimation(false, enemyMove.name === '破坏光线' ? 'special' : '一般', enemyResult.hit);

      if (enemyResult.hit) {
        const newPlayerHp = Math.max(0, playerHp - enemyResult.damage);
        // Delay damage update slightly to sync with animation hit
        setTimeout(() => setPlayerHp(newPlayerHp), 300);

        addLog(`对手的 ${enemyPokemon.name} 使用了 ${enemyMove.name}！造成了 ${enemyResult.damage} 点伤害。`);

        if (newPlayerHp === 0) {
          setTimeout(() => onGameEnd(false, enemyPokemon.name), 1000);
        } else {
          setIsPlayerTurn(true);
        }
      } else {
        addLog(`对手的 ${enemyPokemon.name} 使用了 ${enemyMove.name}，但是没有命中！`);
        setIsPlayerTurn(true);
      }
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin">
           <RefreshCw size={48} className="text-white" />
        </div>
        <span className="ml-4 text-xl font-bold">正在召唤宝可梦...</span>
      </div>
    );
  }

  if (error || !playerPokemon || !enemyPokemon) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="text-red-500 text-xl font-bold">{error || '加载失败'}</div>
        <button 
          onClick={startGame}
          className="px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 h-screen flex flex-col justify-center">
      
      {/* Battle Arena */}
      <div className="flex-1 flex justify-between items-center relative min-h-[400px] bg-gray-800/50 rounded-3xl p-8 border border-gray-700 mb-4 overflow-hidden">
         {/* Background decoration */}
         <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-blue-900 opacity-50 -z-10"></div>
         
         <PokemonCard pokemon={playerPokemon} isPlayer={true} currentHp={playerHp} animationClass={playerAnim} />
         <div className="text-2xl md:text-4xl font-bold text-white/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">VS</div>
         <PokemonCard pokemon={enemyPokemon} isPlayer={false} currentHp={enemyHp} animationClass={enemyAnim} />
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800 rounded-2xl p-3 md:p-6 border border-gray-700 shadow-2xl flex-1 flex flex-col min-h-0">
        <div className="flex flex-col gap-3 h-full">
          
          {/* Battle Log */}
          <div className="bg-black/40 rounded-xl p-3 h-24 md:h-32 shrink-0 overflow-y-auto font-mono text-xs md:text-sm border border-gray-600 shadow-inner">
            {battleLog.map((log, i) => (
              <div key={i} className={`mb-1 ${i === 0 ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>
                {i === 0 ? '> ' : ''}{log}
              </div>
            ))}
          </div>

          {/* Moves */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1 min-h-0">
            {playerPokemon.moves.map((move, i) => (
              <button
                key={i}
                disabled={!isPlayerTurn}
                onClick={() => handleTurn(i)}
                className={`
                  relative overflow-hidden p-2 md:p-4 rounded-xl font-bold text-left transition-all flex flex-col justify-center
                  ${isPlayerTurn 
                    ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95' 
                    : 'bg-gray-700 opacity-50 cursor-not-allowed'}
                `}
              >
                <div className="flex justify-between items-center z-10 relative w-full">
                  <span className="text-sm md:text-base truncate">{move.name}</span>
                  <span className="text-[10px] md:text-xs opacity-70 whitespace-nowrap ml-1">{move.type}</span>
                </div>
                <div className="text-[10px] md:text-xs font-normal opacity-60 mt-0.5">威力: {move.power}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-2 text-center text-gray-500 text-[10px] md:text-xs shrink-0">
          {isPlayerTurn ? "轮到你了！请选择一个招式。" : `等待 ${enemyPokemon.name} 行动...`}
        </div>
      </div>
    </div>
  );
};

export default Battle;
