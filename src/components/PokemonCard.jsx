import React from 'react';

const PokemonCard = ({ pokemon, isPlayer, currentHp, animationClass }) => {
  const hpPercentage = Math.max(0, (currentHp / pokemon.stats.maxHp) * 100);
  
  let hpColor = 'bg-green-500';
  if (hpPercentage < 50) hpColor = 'bg-yellow-500';
  if (hpPercentage < 20) hpColor = 'bg-red-500';

  return (
    <div className={`relative flex flex-col items-center p-2 transition-all duration-500 w-full ${isPlayer ? 'self-end' : 'self-start'}`}>
      <div className={`bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl w-full max-w-[200px] md:max-w-xs ${isPlayer ? 'order-last mt-4' : 'order-first mb-4'}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold capitalize text-base md:text-lg truncate">{pokemon.name}</span>
          <span className="text-xs text-gray-300 whitespace-nowrap ml-2">Lv 50</span>
        </div>
        
        {/* Health Bar */}
        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden border border-gray-600 mb-1">
          <div 
            className={`h-full ${hpColor} health-bar-fill`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <div className="text-right text-[10px] md:text-xs text-gray-400">
          {Math.ceil(currentHp)} / {pokemon.stats.maxHp} HP
        </div>
      </div>

      <div className={`relative ${animationClass} ${isPlayer ? 'order-first' : 'order-last'}`}>
        <div className="w-24 md:w-32 h-6 md:h-8 bg-black/30 rounded-[100%] absolute bottom-0 blur-sm transform translate-y-2 left-1/2 -translate-x-1/2"></div>
        <img 
          src={isPlayer ? pokemon.sprites.back : pokemon.sprites.front} 
          alt={pokemon.name}
          className={`w-32 h-32 md:w-48 md:h-48 object-contain pixelated transition-transform ${isPlayer ? 'scale-125' : 'scale-110'}`}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
};

export default PokemonCard;
