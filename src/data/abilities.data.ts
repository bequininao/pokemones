import { Ability } from '../models/creature.model';

export const ABILITIES: { [key: string]: Ability } = {
  BLAZE: {
    name: 'Blaze',
    description: 'Powers up Fire-type moves when HP is low.',
  },
  TORRENT: {
    name: 'Torrent',
    description: 'Powers up Water-type moves when HP is low.',
  },
  OVERGROW: {
    name: 'Overgrow',
    description: 'Powers up Grass-type moves when HP is low.',
  },
  STATIC: {
    name: 'Static',
    description: 'May cause paralysis on contact.',
  },
  INTIMIDATE: {
    name: 'Intimidate',
    description: 'Lowers the foe\'s Attack stat upon entry.',
  },
  GUTS: {
    name: 'Guts',
    description: 'Boosts Attack if there is a status problem.',
  },
  LEVITATE: {
    name: 'Levitate',
    description: 'Gives full immunity to all Ground-type moves.',
  },
  ROCK_HEAD: {
    name: 'Rock Head',
    description: 'Protects the Pokémon from recoil damage.',
  },
  VOLT_ABSORB: {
    name: 'Volt Absorb',
    description: 'Restores HP if hit by an Electric-type move.',
  },
  NATURAL_CURE: {
    name: 'Natural Cure',
    description: 'All status conditions heal when the Pokémon switches out.',
  },
  INNER_FOCUS: {
    name: 'Inner Focus',
    description: 'Protects the Pokémon from flinching.',
  },
};
