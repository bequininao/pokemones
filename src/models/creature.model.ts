export type CreatureType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Rock' | 'Flying' | 'Normal' | 'Poison' | 'Psychic' | 'Ghost' | 'Ice' | 'Ground' | 'Fighting';

export type StatusEffect = 'paralyzed' | 'burned' | 'none';

export type Stat = 'attack' | 'defense' | 'speed';

export interface Ability {
  name: string;
  description: string;
}

export interface Attack {
  name: string;
  type: CreatureType;
  power: number;
  accuracy: number; // 0-100
  animationType: 'physical' | 'projectile' | 'status';
  effect?: 'paralyze' | 'burn' | 'heal' | 'stat_up' | 'stat_down';
  effectChance?: number; // 0-1
  target?: 'self' | 'opponent';
  stat?: Stat;
}

export interface CreatureStats {
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Creature {
  id: number;
  uid: string; // Unique instance ID for tracking in teams
  name: string;
  level: number;
  type: CreatureType;
  ability: Ability;
  baseStats: CreatureStats;
  currentHp: number;
  attacks: Attack[];
  status: StatusEffect;
  statModifiers: {
    attack: number;
    defense: number;
    speed: number;
  };
  spriteUrl: string;
  backSpriteUrl: string;
}

// Helper to create a deep copy of a creature instance for battles
export function createCreatureInstance(creatureTemplate: Creature): Creature {
  // Deep copy to avoid reference issues
  const newInstance = JSON.parse(JSON.stringify(creatureTemplate));
  
  return {
    ...newInstance,
    uid: `${newInstance.id}-${Math.random().toString(36).substr(2, 9)}`,
    currentHp: newInstance.baseStats.maxHp,
    status: 'none',
    statModifiers: { attack: 1, defense: 1, speed: 1 },
  };
}