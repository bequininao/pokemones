
import { CreatureType } from './creature.model';

// Effectiveness multipliers: 2 = super effective, 0.5 = not very effective, 0 = no effect, 1 = normal
export const TYPE_CHART: { [key in CreatureType]?: { [key in CreatureType]?: number } } = {
  Fire: {
    Water: 0.5,
    Grass: 2,
    Rock: 0.5,
    Fire: 0.5,
  },
  Water: {
    Fire: 2,
    Grass: 0.5,
    Electric: 0.5,
    Water: 0.5,
    Rock: 2,
  },
  Grass: {
    Fire: 0.5,
    Water: 2,
    Flying: 0.5,
    Grass: 0.5,
    Rock: 2,
  },
  Electric: {
    Water: 2,
    Grass: 0.5,
    Electric: 0.5,
    Flying: 2,
  },
  Rock: {
    Fire: 2,
    Water: 0.5,
    Grass: 0.5,
    Flying: 2,
  },
  Flying: {
    Grass: 2,
    Electric: 0.5,
    Rock: 0.5,
  },
  Normal: {
    Rock: 0.5,
  },
};

export function getEffectiveness(attackType: CreatureType, targetType: CreatureType): number {
  return TYPE_CHART[attackType]?.[targetType] ?? 1;
}
