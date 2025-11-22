import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1; // Gen 1 Pokemon

export const fetchPokemon = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
    const data = response.data;
    
    // Fetch species data for Chinese name
    let chineseName = data.name;
    try {
      if (data.species && data.species.url) {
        const speciesResponse = await axios.get(data.species.url);
        const chineseNameEntry = speciesResponse.data.names?.find(n => n.language.name === 'zh-Hans');
        if (chineseNameEntry) chineseName = chineseNameEntry.name;
      }
    } catch (err) {
      console.warn("Failed to fetch species data:", err);
      // Fallback to English name is already set
    }
    
    // Simplified stats
    const hp = data.stats.find(s => s.stat.name === 'hp').base_stat;
    const attack = data.stats.find(s => s.stat.name === 'attack').base_stat;
    const defense = data.stats.find(s => s.stat.name === 'defense').base_stat;

    // Simplified moves (random 4)
    // In a real app, we'd fetch move details. Here we just mock standard moves for gameplay.
    const moves = [
      { name: '撞击', power: 40, type: '一般', accuracy: 100 },
      { name: '抓', power: 40, type: '一般', accuracy: 100 },
      { name: '泰山压顶', power: 85, type: '一般', accuracy: 90 },
      { name: '破坏光线', power: 150, type: '一般', accuracy: 70 } // High risk
    ];

    return {
      id: data.id,
      name: chineseName,
      sprites: {
        front: data.sprites.front_default,
        back: data.sprites.back_default,
      },
      stats: {
        hp,
        maxHp: hp * 3, // Inflate HP for longer battles
        attack,
        defense
      },
      moves
    };
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    return null;
  }
};

export const calculateDamage = (attacker, defender, move) => {
  const random = Math.floor(Math.random() * 15) + 85; // 0.85 to 1.00 variation
  const hit = Math.random() * 100 <= move.accuracy;
  
  if (!hit) return { damage: 0, hit: false };

  // Simplified damage formula
  const damage = Math.floor(
    ((((2 * 50 / 5 + 2) * move.power * (attacker.stats.attack / defender.stats.defense)) / 50) + 2) * random / 100
  );

  return { damage, hit: true };
};
