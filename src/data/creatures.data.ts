import { Creature } from '../models/creature.model';
import { ATTACKS } from './attacks.data';
import { ABILITIES } from './abilities.data';

const getSpriteUrl = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
const getBackSpriteUrl = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`;

export const CREATURES: Creature[] = [
  // Starters
  {
    id: 3, name: 'Venusaur', level: 50, type: 'Grass', ability: ABILITIES['OVERGROW'],
    baseStats: { maxHp: 80, attack: 82, defense: 83, speed: 80 },
    attacks: [ATTACKS['RAZOR_LEAF'], ATTACKS['VINE_WHIP'], ATTACKS['TACKLE'], ATTACKS['STUN_SPORE']],
    spriteUrl: getSpriteUrl(3), backSpriteUrl: getBackSpriteUrl(3),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  {
    id: 6, name: 'Charizard', level: 50, type: 'Fire', ability: ABILITIES['BLAZE'],
    baseStats: { maxHp: 78, attack: 84, defense: 78, speed: 100 },
    attacks: [ATTACKS['FLAMETHROWER'], ATTACKS['WING_ATTACK'], ATTACKS['SCRATCH'], ATTACKS['ROAR']],
    spriteUrl: getSpriteUrl(6), backSpriteUrl: getBackSpriteUrl(6),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  {
    id: 9, name: 'Blastoise', level: 50, type: 'Water', ability: ABILITIES['TORRENT'],
    baseStats: { maxHp: 79, attack: 83, defense: 100, speed: 78 },
    attacks: [ATTACKS['SURF'], ATTACKS['WATER_GUN'], ATTACKS['TACKLE'], ATTACKS['HARDEN']],
    spriteUrl: getSpriteUrl(9), backSpriteUrl: getBackSpriteUrl(9),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  // Electric
  {
    id: 26, name: 'Raichu', level: 50, type: 'Electric', ability: ABILITIES['STATIC'],
    baseStats: { maxHp: 60, attack: 90, defense: 55, speed: 110 },
    attacks: [ATTACKS['THUNDERBOLT'], ATTACKS['SPARK'], ATTACKS['QUICK_ATTACK'], ATTACKS['TAIL_WHIP']],
    spriteUrl: getSpriteUrl(26), backSpriteUrl: getBackSpriteUrl(26),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  // Rock/Ground
  {
    id: 76, name: 'Golem', level: 50, type: 'Rock', ability: ABILITIES['ROCK_HEAD'],
    baseStats: { maxHp: 80, attack: 120, defense: 130, speed: 45 },
    attacks: [ATTACKS['ROCK_THROW'], ATTACKS['EARTHQUAKE'], ATTACKS['ROLLOUT'], ATTACKS['HARDEN']],
    spriteUrl: getSpriteUrl(76), backSpriteUrl: getBackSpriteUrl(76),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  // Flying
  {
    id: 18, name: 'Pidgeot', level: 50, type: 'Flying', ability: ABILITIES['INNER_FOCUS'],
    baseStats: { maxHp: 83, attack: 80, defense: 75, speed: 101 },
    attacks: [ATTACKS['WING_ATTACK'], ATTACKS['GUST'], ATTACKS['QUICK_ATTACK'], ATTACKS['TACKLE']],
    spriteUrl: getSpriteUrl(18), backSpriteUrl: getBackSpriteUrl(18),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  // Ghost
  {
    id: 94, name: 'Gengar', level: 50, type: 'Ghost', ability: ABILITIES['LEVITATE'],
    baseStats: { maxHp: 60, attack: 65, defense: 60, speed: 110 },
    attacks: [ATTACKS['SHADOW_BALL'], ATTACKS['LICK'], ATTACKS['CONFUSION'], ATTACKS['STUN_SPORE']],
    spriteUrl: getSpriteUrl(94), backSpriteUrl: getBackSpriteUrl(94),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  // Psychic
  {
    id: 65, name: 'Alakazam', level: 50, type: 'Psychic', ability: ABILITIES['INNER_FOCUS'],
    baseStats: { maxHp: 55, attack: 50, defense: 45, speed: 120 },
    attacks: [ATTACKS['PSYCHIC'], ATTACKS['CONFUSION'], ATTACKS['QUICK_ATTACK'], ATTACKS['TAIL_WHIP']],
    spriteUrl: getSpriteUrl(65), backSpriteUrl: getBackSpriteUrl(65),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  // Fighting
  {
    id: 68, name: 'Machamp', level: 50, type: 'Fighting', ability: ABILITIES['GUTS'],
    baseStats: { maxHp: 90, attack: 130, defense: 80, speed: 55 },
    attacks: [ATTACKS['CROSS_CHOP'], ATTACKS['KARATE_CHOP'], ATTACKS['ROAR'], ATTACKS['HARDEN']],
    spriteUrl: getSpriteUrl(68), backSpriteUrl: getBackSpriteUrl(68),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  // Normal
  {
    id: 143, name: 'Snorlax', level: 50, type: 'Normal', ability: ABILITIES['GUTS'],
    baseStats: { maxHp: 160, attack: 110, defense: 65, speed: 30 },
    attacks: [ATTACKS['HYPER_BEAM'], ATTACKS['TACKLE'], ATTACKS['HARDEN'], ATTACKS['ROLLOUT']],
    spriteUrl: getSpriteUrl(143), backSpriteUrl: getBackSpriteUrl(143),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
    // More variety
  {
    id: 59, name: 'Arcanine', level: 50, type: 'Fire', ability: ABILITIES['INTIMIDATE'],
    baseStats: { maxHp: 90, attack: 110, defense: 80, speed: 95 },
    attacks: [ATTACKS['FLAMETHROWER'], ATTACKS['QUICK_ATTACK'], ATTACKS['ROAR'], ATTACKS['TACKLE']],
    spriteUrl: getSpriteUrl(59), backSpriteUrl: getBackSpriteUrl(59),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  {
    id: 131, name: 'Lapras', level: 50, type: 'Water', ability: ABILITIES['TORRENT'],
    baseStats: { maxHp: 130, attack: 85, defense: 80, speed: 60 },
    attacks: [ATTACKS['SURF'], ATTACKS['AQUA_JET'], ATTACKS['WATER_GUN'], ATTACKS['ROAR']],
    spriteUrl: getSpriteUrl(131), backSpriteUrl: getBackSpriteUrl(131),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  {
    id: 130, name: 'Gyarados', level: 50, type: 'Water', ability: ABILITIES['INTIMIDATE'],
    baseStats: { maxHp: 95, attack: 125, defense: 79, speed: 81 },
    attacks: [ATTACKS['SURF'], ATTACKS['TACKLE'], ATTACKS['ROAR'], ATTACKS['HYPER_BEAM']],
    spriteUrl: getSpriteUrl(130), backSpriteUrl: getBackSpriteUrl(130),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  {
    id: 149, name: 'Dragonite', level: 50, type: 'Flying', ability: ABILITIES['INNER_FOCUS'],
    baseStats: { maxHp: 91, attack: 134, defense: 95, speed: 80 },
    attacks: [ATTACKS['WING_ATTACK'], ATTACKS['HYPER_BEAM'], ATTACKS['QUICK_ATTACK'], ATTACKS['ROAR']],
    spriteUrl: getSpriteUrl(149), backSpriteUrl: getBackSpriteUrl(149),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
   {
    id: 121, name: 'Starmie', level: 50, type: 'Water', ability: ABILITIES['NATURAL_CURE'],
    baseStats: { maxHp: 60, attack: 75, defense: 85, speed: 115 },
    attacks: [ATTACKS['SURF'], ATTACKS['PSYCHIC'], ATTACKS['QUICK_ATTACK'], ATTACKS['HARDEN']],
    spriteUrl: getSpriteUrl(121), backSpriteUrl: getBackSpriteUrl(121),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  {
    id: 112, name: 'Rhydon', level: 50, type: 'Rock', ability: ABILITIES['ROCK_HEAD'],
    baseStats: { maxHp: 105, attack: 130, defense: 120, speed: 40 },
    attacks: [ATTACKS['EARTHQUAKE'], ATTACKS['ROCK_THROW'], ATTACKS['TACKLE'], ATTACKS['ROAR']],
    spriteUrl: getSpriteUrl(112), backSpriteUrl: getBackSpriteUrl(112),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
   {
    id: 103, name: 'Exeggutor', level: 50, type: 'Grass', ability: ABILITIES['OVERGROW'],
    baseStats: { maxHp: 95, attack: 95, defense: 85, speed: 55 },
    attacks: [ATTACKS['PSYCHIC'], ATTACKS['STUN_SPORE'], ATTACKS['TACKLE'], ATTACKS['RAZOR_LEAF']],
    spriteUrl: getSpriteUrl(103), backSpriteUrl: getBackSpriteUrl(103),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
  {
    id: 25, name: 'Pikachu', level: 50, type: 'Electric', ability: ABILITIES['STATIC'],
    baseStats: { maxHp: 35, attack: 55, defense: 40, speed: 90 },
    attacks: [ATTACKS['THUNDERBOLT'], ATTACKS['QUICK_ATTACK'], ATTACKS['TAIL_WHIP'], ATTACKS['SPARK']],
    spriteUrl: getSpriteUrl(25), backSpriteUrl: getBackSpriteUrl(25),
    uid: '', currentHp: 0, status: 'none', statModifiers: { attack: 1, defense: 1, speed: 1 }
  },
];