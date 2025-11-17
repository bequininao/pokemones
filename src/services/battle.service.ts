import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import { Attack, Creature, createCreatureInstance, Stat, StatusEffect } from '../models/creature.model';
import { CREATURES } from '../data/creatures.data';
import { getEffectiveness } from '../models/type-chart.model';

export type BattlePhase = 'intro' | 'select_action' | 'processing_turn' | 'awaiting_switch' | 'battle_over';
export type BattleResult = 'player_win' | 'player_lose' | 'ongoing';
export type AppState = 'team_selection' | 'battle' | 'game_over';

export type BattleAnimationEvent = 
  | { type: 'attack', attacker: 'player' | 'opponent', attack: Attack }
  | { type: 'damage', target: 'player' | 'opponent', effectiveness: number, fainted: boolean }
  | { type: 'miss', target: 'player' | 'opponent' }
  | { type: 'stat_change', target: 'player' | 'opponent', self: boolean, stat: Stat, direction: 'up' | 'down' }
  | { type: 'status_effect', target: 'player' | 'opponent', effect: StatusEffect }
  | { type: 'ability_trigger', target: 'player' | 'opponent', abilityName: string }
  | null;

type TurnAction = 
  | { type: 'attack', user: 'player' | 'opponent', attack: Attack, speed: number }
  | { type: 'switch', user: 'player', newCreatureIndex: number };


@Injectable({ providedIn: 'root' })
export class BattleService {
  playerTeam: WritableSignal<Creature[]> = signal([]);
  opponentTeam: WritableSignal<Creature[]> = signal([]);

  activePlayerCreature: WritableSignal<Creature | null> = signal(null);
  activeOpponentCreature: WritableSignal<Creature | null> = signal(null);

  battleLog: WritableSignal<string[]> = signal([]);
  battlePhase: WritableSignal<BattlePhase> = signal('intro');
  battleResult: WritableSignal<BattleResult> = signal('ongoing');
  animationEvent: WritableSignal<BattleAnimationEvent> = signal(null);

  async startBattle(playerTeamSelection: Creature[]) {
    const playerTeamInstances = playerTeamSelection.map(c => createCreatureInstance(c));
    this.playerTeam.set(playerTeamInstances);
    this.activePlayerCreature.set(playerTeamInstances[0]);

    const opponentTeamInstances = this.generateOpponentTeam();
    this.opponentTeam.set(opponentTeamInstances);
    this.activeOpponentCreature.set(opponentTeamInstances[0]);

    this.battleLog.set([]);
    this.battlePhase.set('intro');
    this.battleResult.set('ongoing');

    await this.delay(1000);
    this.addLog(`Your opponent sent out ${this.activeOpponentCreature()?.name}!`);
    await this.checkSwitchInAbilities(this.activeOpponentCreature, this.activePlayerCreature);

    this.addLog(`Go, ${this.activePlayerCreature()?.name}!`);
    await this.checkSwitchInAbilities(this.activePlayerCreature, this.activeOpponentCreature);

    this.battlePhase.set('select_action');
  }
  
  private generateOpponentTeam(): Creature[] {
    const shuffled = [...CREATURES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6).map(c => createCreatureInstance(c));
  }

  handlePlayerAction(action: TurnAction) {
    if (this.battlePhase() !== 'select_action') return;
    this.battlePhase.set('processing_turn');
    this.animationEvent.set(null);

    const opponent = this.activeOpponentCreature() as Creature;
    const opponentAttack = opponent.attacks[Math.floor(Math.random() * opponent.attacks.length)];
    const opponentAction: TurnAction = { 
        type: 'attack', 
        user: 'opponent', 
        attack: opponentAttack, 
        speed: opponent.baseStats.speed * opponent.statModifiers.speed
    };

    let turnOrder: (TurnAction | null)[] = [action, opponentAction];

    if (action.type === 'switch') {
        turnOrder = [action, opponentAction]; // Switch has priority
    } else {
        const playerSpeed = this.activePlayerCreature()!.baseStats.speed * this.activePlayerCreature()!.statModifiers.speed;
        turnOrder = playerSpeed >= opponentAction.speed ? [action, opponentAction] : [opponentAction, action];
    }
    
    this.executeTurn(turnOrder);
  }

  handlePlayerSwitch(newCreatureIndex: number) {
    const action: TurnAction = { type: 'switch', user: 'player', newCreatureIndex };
    this.handlePlayerAction(action);
  }

  async forcePlayerSwitch(newCreatureIndex: number) {
     if (this.battlePhase() !== 'awaiting_switch') return;
     await this.switchCreature('player', newCreatureIndex);
     this.addLog(`Go, ${this.activePlayerCreature()?.name}!`);
     
     // After forced switch, opponent gets a free turn
     const opponent = this.activeOpponentCreature() as Creature;
     if (opponent.currentHp > 0) {
        const opponentAttack = opponent.attacks[Math.floor(Math.random() * opponent.attacks.length)];
        const opponentAction: TurnAction = { 
            type: 'attack', 
            user: 'opponent', 
            attack: opponentAttack, 
            speed: opponent.baseStats.speed * opponent.statModifiers.speed
        };
        this.executeTurn([opponentAction]);
     } else {
        this.handleOpponentFaint();
     }
  }

  private async switchCreature(user: 'player' | 'opponent', newCreatureIndex: number) {
      if (user === 'player') {
          const oldCreature = this.activePlayerCreature();
          if (oldCreature?.ability.name === 'Natural Cure' && oldCreature.status !== 'none') {
            this.playerTeam.update(team => {
                const teamMember = team.find(c => c.uid === oldCreature.uid);
                if (teamMember) teamMember.status = 'none';
                return team;
            });
            this.addLog(`${oldCreature.name}'s ${oldCreature.ability.name} healed its status!`);
            await this.delay(1000);
          }
          this.activePlayerCreature.set(this.playerTeam()[newCreatureIndex]);
          await this.checkSwitchInAbilities(this.activePlayerCreature, this.activeOpponentCreature);
      } else {
          this.activeOpponentCreature.set(this.opponentTeam()[newCreatureIndex]);
          await this.checkSwitchInAbilities(this.activeOpponentCreature, this.activePlayerCreature);
      }
  }

  private async executeTurn(actions: (TurnAction | null)[]) {
    for (const action of actions) {
      if (!action || this.battleResult() !== 'ongoing') break;
      
      if (action.type === 'switch') {
          this.addLog(`You withdrew ${this.activePlayerCreature()?.name}!`);
          await this.delay(800);
          await this.switchCreature('player', action.newCreatureIndex);
          this.addLog(`Go, ${this.activePlayerCreature()?.name}!`);
          await this.delay(800);
      } else {
         const attacker = action.user === 'player' ? this.activePlayerCreature : this.activeOpponentCreature;
         const defender = action.user === 'player' ? this.activeOpponentCreature : this.activePlayerCreature;
         await this.processAttack(attacker, defender, action.attack);
      }
    }

    if (this.battleResult() === 'ongoing' && this.battlePhase() !== 'awaiting_switch') {
        this.battlePhase.set('select_action');
    }
  }

  private async processAttack(attackerSignal: WritableSignal<Creature | null>, defenderSignal: WritableSignal<Creature | null>, attack: Attack) {
    const attacker = attackerSignal()!;
    const defender = defenderSignal()!;
    const attackerRef = attackerSignal === this.activePlayerCreature ? 'player' : 'opponent';
    const defenderRef = defenderSignal === this.activePlayerCreature ? 'player' : 'opponent';

    if (defender.ability.name === 'Levitate' && attack.type === 'Ground') {
        this.addLog(`${defender.name} avoided the attack with Levitate!`);
        await this.delay(1000);
        return;
    }

    this.addLog(`${attacker.name} used ${attack.name}!`);
    this.animationEvent.set({ type: 'attack', attacker: attackerRef, attack });
    await this.delay(800);

    if (attacker.status === 'paralyzed' && Math.random() < 0.25) {
      this.addLog(`${attacker.name} is fully paralyzed!`);
      this.animationEvent.set(null);
      await this.delay(1000);
      return;
    }
    
    if (Math.random() * 100 > attack.accuracy) {
      this.addLog(`${attacker.name}'s attack missed!`);
      this.animationEvent.set({ type: 'miss', target: defenderRef });
      await this.delay(1000);
      this.animationEvent.set(null);
      return;
    }

    if (attack.power === 0 && attack.effect?.includes('stat')) {
        this.applyStatChange(attack, attackerSignal, defenderSignal);
        await this.delay(1000);
        this.animationEvent.set(null);
        return;
    }
    
    let attackerAttack = attacker.baseStats.attack * attacker.statModifiers.attack;
    if(attacker.ability.name === 'Guts' && attacker.status !== 'none') {
        attackerAttack *= 1.5;
    }

    const defenderDefense = defender.baseStats.defense * defender.statModifiers.defense;
    
    let damage = ((attackerAttack / defenderDefense) * attack.power / 6) + 2;

    const hpRatio = attacker.currentHp / attacker.baseStats.maxHp;
    if ((attacker.ability.name === 'Blaze' && attack.type === 'Fire' && hpRatio < 1/3) ||
        (attacker.ability.name === 'Torrent' && attack.type === 'Water' && hpRatio < 1/3) ||
        (attacker.ability.name === 'Overgrow' && attack.type === 'Grass' && hpRatio < 1/3)) {
        damage *= 1.5;
    }

    damage *= (Math.random() * 0.15 + 0.85);

    const effectiveness = getEffectiveness(attack.type, defender.type);
    damage *= effectiveness;
    damage = Math.floor(damage);

    let fainted = false;
    defenderSignal.update(d => {
      if (!d) return null;
      const newHp = Math.max(0, d.currentHp - damage);
      if (newHp === 0) fainted = true;
      return { ...d, currentHp: newHp };
    });

    this.animationEvent.set({ type: 'damage', target: defenderRef, effectiveness, fainted });

    await this.delay(500);

    if (effectiveness > 1) this.addLog("It's super effective!");
    else if (effectiveness < 1 && effectiveness > 0) this.addLog("It's not very effective...");
    else if (effectiveness === 0) this.addLog(`It doesn't affect ${defender.name}...`);
    
    await this.delay(800);
    
    // Post-damage effects
    if (attack.animationType === 'physical' && defender.ability.name === 'Static' && Math.random() < 0.3) {
        this.addLog(`${defender.name}'s Static paralyzed ${attacker.name}!`);
        this.animationEvent.set({ type: 'ability_trigger', target: defenderRef, abilityName: 'Static' });
        await this.delay(800);
        this.applyStatusEffect('paralyzed', attackerSignal);
        await this.delay(800);
    }
    
    if (fainted) {
        this.addLog(`${defender.name} fainted!`);
        await this.delay(1000);

        if (defenderRef === 'player') {
            const hasMoreCreatures = this.playerTeam().some(c => c.currentHp > 0);
            if (!hasMoreCreatures) {
                this.battleResult.set('player_lose');
                this.battlePhase.set('battle_over');
            } else {
                this.battlePhase.set('awaiting_switch');
            }
        } else {
            await this.handleOpponentFaint();
        }
        return;
    }

    if (attack.effect && attack.effectChance && Math.random() < attack.effectChance) {
        if (attack.effect === 'paralyzed' || attack.effect === 'burned') {
             this.applyStatusEffect(attack.effect, defenderSignal);
             await this.delay(800);
        }
    }

    this.animationEvent.set(null);
    await this.delay(800);
  }

  private async handleOpponentFaint() {
    const hasMoreCreatures = this.opponentTeam().some(c => c.currentHp > 0);
    if (!hasMoreCreatures) {
        this.battleResult.set('player_win');
        this.battlePhase.set('battle_over');
    } else {
        const nextCreatureIndex = this.opponentTeam().findIndex(c => c.currentHp > 0);
        if (nextCreatureIndex !== -1) {
            this.addLog(`Your opponent sent out ${this.opponentTeam()[nextCreatureIndex].name}!`);
            await this.switchCreature('opponent', nextCreatureIndex);
        }
    }
  }

  private async checkSwitchInAbilities(switcherSignal: WritableSignal<Creature | null>, targetSignal: WritableSignal<Creature | null>) {
    const switcher = switcherSignal()!;
    if (switcher.ability.name === 'Intimidate') {
        const switcherRef = switcherSignal === this.activePlayerCreature ? 'player' : 'opponent';
        const targetRef = targetSignal === this.activePlayerCreature ? 'player' : 'opponent';
        this.addLog(`${switcher.name}'s Intimidate cut ${targetSignal()!.name}'s attack!`);
        this.animationEvent.set({ type: 'ability_trigger', target: switcherRef, abilityName: 'Intimidate' });
        
        targetSignal.update(c => {
            if (!c) return null;
            const newModifiers = {...c.statModifiers};
            newModifiers['attack'] = Math.max(0.25, newModifiers['attack'] / 1.5);
            return {...c, statModifiers: newModifiers};
        });
        
        await this.delay(1200);
        this.animationEvent.set(null);
    }
  }

  private applyStatChange(attack: Attack, user: WritableSignal<Creature | null>, target: WritableSignal<Creature | null>) {
    const targetSignal = attack.target === 'self' ? user : target;
    const targetRef = targetSignal === this.activePlayerCreature ? 'player' : 'opponent';
    const stat = attack.stat as Stat;

    targetSignal.update(c => {
        if (!c) return null;
        const newModifiers = {...c.statModifiers};
        if (attack.effect === 'stat_up') {
            newModifiers[stat] = Math.min(4, newModifiers[stat] * 1.5);
            this.addLog(`${c.name}'s ${stat} rose!`);
            this.animationEvent.set({ type: 'stat_change', target: targetRef, self: attack.target === 'self', stat, direction: 'up' });
        } else {
            newModifiers[stat] = Math.max(0.25, newModifiers[stat] / 1.5);
            this.addLog(`${c.name}'s ${stat} fell!`);
            this.animationEvent.set({ type: 'stat_change', target: targetRef, self: attack.target === 'self', stat, direction: 'down' });
        }
        return {...c, statModifiers: newModifiers};
    });
  }
  
  private applyStatusEffect(effect: 'paralyzed' | 'burned', target: WritableSignal<Creature | null>) {
    if (target()!.status !== 'none') return;
    target.update(c => c ? ({...c, status: effect}) : null);
    this.addLog(`${target()!.name} was ${effect}!`);
    const targetRef = target === this.activePlayerCreature ? 'player' : 'opponent';
    this.animationEvent.set({ type: 'status_effect', target: targetRef, effect});
  }

  private addLog(message: string) {
    this.battleLog.update(logs => [message, ...logs].slice(0, 5));
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}