import React from 'react';

const PokemonCard = ({ pokemon, isPlayer, currentHp, animationClass }) => {
  const hpPercentage = Math.max(0, (currentHp / pokemon.stats.maxHp) * 100);
  
  let hpColor = 'bg-green-500';
  if (hpPercentage < 50) hpColor = 'bg-yellow-500';
  if (hpPercentage < 20) hpColor = 'bg-red-500';

  return (
    <div className={`relative flex flex-col items-center p-4 transition-all duration-500 ${isPlayer ? 'self-start' : 'self-end'}`}>
      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl w-64">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold capitalize text-lg">{pokemon.name}</span>
          <span className="text-sm text-gray-300">Lvl 50</span>
        </div>
        
        {/* Health Bar */}
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden border border-gray-600 mb-1">
          <div 
            className={`h-full ${hpColor} health-bar-fill`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-400 mb-2">
          {Math.ceil(currentHp)} / {pokemon.stats.maxHp} HP
        </div>
      </div>

      <div className={`mt-4 relative ${isPlayer ? 'order-first mb-4' : ''} ${animationClass}`}>
        <div className="w-32 h-8 bg-black/30 rounded-[100%] absolute bottom-0 blur-sm transform translate-y-2"></div>
        <img 
          src={isPlayer ? pokemon.sprites.back : pokemon.sprites.front} 
          alt={pokemon.name}
          className={`w-48 h-48 object-contain pixelated transition-transform ${isPlayer ? 'scale-125 hover:scale-110' : 'scale-110'}`}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
};

export default PokemonCard;
