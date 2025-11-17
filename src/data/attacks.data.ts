import { Attack } from '../models/creature.model';

export const ATTACKS: { [key: string]: Attack } = {
  // Normal
  SCRATCH: { name: 'Scratch', type: 'Normal', power: 40, accuracy: 100, animationType: 'physical' },
  TACKLE: { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, animationType: 'physical' },
  QUICK_ATTACK: { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, animationType: 'physical' },
  ROAR: { name: 'Roar', type: 'Normal', power: 0, accuracy: 100, effect: 'stat_down', stat: 'attack', target: 'opponent', animationType: 'status' },
  HARDEN: { name: 'Harden', type: 'Normal', power: 0, accuracy: 100, effect: 'stat_up', stat: 'defense', target: 'self', animationType: 'status' },
  TAIL_WHIP: { name: 'Tail Whip', type: 'Normal', power: 0, accuracy: 100, effect: 'stat_down', stat: 'defense', target: 'opponent', animationType: 'status' },
  HYPER_BEAM: { name: 'Hyper Beam', type: 'Normal', power: 150, accuracy: 90, animationType: 'projectile' },

  // Fire
  EMBER: { name: 'Ember', type: 'Fire', power: 40, accuracy: 100, effect: 'burn', effectChance: 0.1, animationType: 'projectile' },
  FLAME_WHEEL: { name: 'Flame Wheel', type: 'Fire', power: 60, accuracy: 100, effect: 'burn', effectChance: 0.1, animationType: 'physical' },
  FLAMETHROWER: { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100, effect: 'burn', effectChance: 0.1, animationType: 'projectile' },
  
  // Water
  WATER_GUN: { name: 'Water Gun', type: 'Water', power: 40, accuracy: 100, animationType: 'projectile' },
  AQUA_JET: { name: 'Aqua Jet', type: 'Water', power: 40, accuracy: 100, animationType: 'physical' },
  SURF: { name: 'Surf', type: 'Water', power: 90, accuracy: 100, animationType: 'projectile' },
  
  // Grass
  VINE_WHIP: { name: 'Vine Whip', type: 'Grass', power: 45, accuracy: 100, animationType: 'physical' },
  RAZOR_LEAF: { name: 'Razor Leaf', type: 'Grass', power: 55, accuracy: 95, animationType: 'physical' },
  STUN_SPORE: { name: 'Stun Spore', type: 'Grass', power: 0, accuracy: 75, effect: 'paralyze', animationType: 'status' },
  
  // Electric
  THUNDER_SHOCK: { name: 'Thunder Shock', type: 'Electric', power: 40, accuracy: 100, effect: 'paralyze', effectChance: 0.1, animationType: 'status' },
  SPARK: { name: 'Spark', type: 'Electric', power: 65, accuracy: 100, effect: 'paralyze', effectChance: 0.3, animationType: 'physical' },
  THUNDERBOLT: { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100, effect: 'paralyze', effectChance: 0.1, animationType: 'projectile' },

  // Rock
  ROCK_THROW: { name: 'Rock Throw', type: 'Rock', power: 50, accuracy: 90, animationType: 'physical' },
  ROLLOUT: { name: 'Rollout', type: 'Rock', power: 30, accuracy: 90, animationType: 'physical' },
  EARTHQUAKE: { name: 'Earthquake', type: 'Ground', power: 100, accuracy: 100, animationType: 'physical' },

  // Flying
  PECK: { name: 'Peck', type: 'Flying', power: 35, accuracy: 100, animationType: 'physical' },
  GUST: { name: 'Gust', type: 'Flying', power: 40, accuracy: 100, animationType: 'projectile' },
  WING_ATTACK: { name: 'Wing Attack', type: 'Flying', power: 60, accuracy: 100, animationType: 'physical' },

  // Psychic
  CONFUSION: { name: 'Confusion', type: 'Psychic', power: 50, accuracy: 100, animationType: 'projectile' },
  PSYCHIC: { name: 'Psychic', type: 'Psychic', power: 90, accuracy: 100, animationType: 'projectile' },

  // Ghost
  LICK: { name: 'Lick', type: 'Ghost', power: 30, accuracy: 100, effect: 'paralyze', effectChance: 0.3, animationType: 'physical' },
  SHADOW_BALL: { name: 'Shadow Ball', type: 'Ghost', power: 80, accuracy: 100, animationType: 'projectile' },

  // Fighting
  KARATE_CHOP: { name: 'Karate Chop', type: 'Fighting', power: 50, accuracy: 100, animationType: 'physical' },
  CROSS_CHOP: { name: 'Cross Chop', type: 'Fighting', power: 100, accuracy: 80, animationType: 'physical' },
};