import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleService, AppState, BattleAnimationEvent } from './services/battle.service';
import { Attack, Creature, CreatureType } from './models/creature.model';
import { BattleHudComponent } from './components/battle-hud/battle-hud.component';
import { CREATURES } from './data/creatures.data';

type AnimationState = 'idle' | 'intro' | 'attacking' | 'hit' | 'status' | 'fainted' | 'ability';
type ProjectileState = { active: boolean; type: CreatureType; from: 'player' | 'opponent' };
type MenuState = 'main' | 'attacks' | 'team';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BattleHudComponent],
})
export class AppComponent {
  battleService = inject(BattleService);
  
  // App State
  appState = signal<AppState>('team_selection');

  // Team Selection State
  allCreatures = signal<Creature[]>(CREATURES);
  selectedTeam = signal<Creature[]>([]);

  // Battle State
  playerTeam = this.battleService.playerTeam;
  opponentTeam = this.battleService.opponentTeam;
  playerCreature = this.battleService.activePlayerCreature;
  opponentCreature = this.battleService.activeOpponentCreature;
  battleLog = this.battleService.battleLog;
  battlePhase = this.battleService.battlePhase;
  battleResult = this.battleService.battleResult;
  
  // UI State
  menuState = signal<MenuState>('main');
  
  // Animation State
  playerAnimation = signal<AnimationState>('intro');
  opponentAnimation = signal<AnimationState>('intro');
  playerAttackType = signal<'physical' | 'projectile' | 'status' | null>(null);
  opponentAttackType = signal<'physical' | 'projectile' | 'status' | null>(null);
  projectile = signal<ProjectileState>({ active: false, type: 'Normal', from: 'player' });

  // Computed Signals
  isTeamSelection = computed(() => this.appState() === 'team_selection');
  isBattle = computed(() => this.appState() === 'battle');
  isGameOver = computed(() => this.appState() === 'game_over');

  canConfirmTeam = computed(() => this.selectedTeam().length === 6);
  
  showActionMenu = computed(() => this.battlePhase() === 'select_action' || this.isAwaitingSwitch());
  isAwaitingSwitch = computed(() => this.battlePhase() === 'awaiting_switch');

  battleMessage = computed(() => {
    if (this.isAwaitingSwitch()) return `Choose your next creature!`;
    const log = this.battleLog()[0];
    if (this.battlePhase() === 'select_action') return `What will ${this.playerCreature()?.name} do?`;
    return log || 'The battle begins...';
  });
  
  constructor() {
    effect(() => {
      const event = this.battleService.animationEvent();
      if (!event) return;
      this.handleAnimationEvent(event);
    }, { allowSignalWrites: true });

    effect(() => {
      const phase = this.battlePhase();
      if (phase === 'intro') {
        this.playerAnimation.set('intro');
        this.opponentAnimation.set('intro');
        setTimeout(() => {
          this.playerAnimation.set('idle');
          this.opponentAnimation.set('idle');
        }, 800);
      } else if (phase === 'battle_over') {
        setTimeout(() => this.appState.set('game_over'), 1500);
      } else if (phase === 'select_action') {
        this.menuState.set('main'); // Reset menu on new turn
      }
    });
  }

  // --- Team Selection Methods ---
  toggleCreatureInTeam(creature: Creature) {
    const currentTeam = this.selectedTeam();
    const index = currentTeam.findIndex(c => c.id === creature.id);
    if (index > -1) {
      this.selectedTeam.set(currentTeam.filter(c => c.id !== creature.id));
    } else if (currentTeam.length < 6) {
      this.selectedTeam.set([...currentTeam, creature]);
    }
  }

  isSelected(creature: Creature): boolean {
    return this.selectedTeam().some(c => c.id === creature.id);
  }

  confirmTeam() {
    if (!this.canConfirmTeam()) return;
    this.battleService.startBattle(this.selectedTeam());
    this.appState.set('battle');
  }

  // --- Battle Methods ---
  onMainMenuSelect(selection: MenuState) {
    if (this.isAwaitingSwitch()) return;
    this.menuState.set(selection);
  }
  
  onAttack(attack: Attack) {
    const playerSpeed = this.playerCreature()!.baseStats.speed * this.playerCreature()!.statModifiers.speed;
    const action = { type: 'attack' as const, user: 'player' as const, attack, speed: playerSpeed };
    this.battleService.handlePlayerAction(action);
  }

  onSwitch(teamIndex: number) {
    if (this.playerTeam()[teamIndex].currentHp <= 0 || this.playerTeam()[teamIndex].uid === this.playerCreature()?.uid) {
      return; // Cannot switch to fainted or active creature
    }
    
    if (this.isAwaitingSwitch()) {
        this.battleService.forcePlayerSwitch(teamIndex);
    } else {
        this.battleService.handlePlayerSwitch(teamIndex);
    }
    this.menuState.set('main');
  }

  restartBattle() {
    this.selectedTeam.set([]);
    this.appState.set('team_selection');
    this.battlePhase.set('intro');
    this.battleResult.set('ongoing');
    this.menuState.set('main');
  }
  
  handleAnimationEvent(event: BattleAnimationEvent) {
    switch (event.type) {
      case 'attack':
        const attackerAnim = event.attacker === 'player' ? this.playerAnimation : this.opponentAnimation;
        const attackerType = event.attacker === 'player' ? this.playerAttackType : this.opponentAttackType;
        attackerAnim.set('attacking');
        attackerType.set(event.attack.animationType);
        if (event.attack.animationType === 'projectile') {
          this.projectile.set({ active: true, type: event.attack.type, from: event.attacker });
        }
        setTimeout(() => this.resetAttackerAnimation(event.attacker), 600);
        break;

      case 'damage':
        const targetAnim = event.target === 'player' ? this.playerAnimation : this.opponentAnimation;
        targetAnim.set('hit');
        if (event.fainted) {
            setTimeout(() => targetAnim.set('fainted'), 500);
        } else {
            setTimeout(() => targetAnim.set('idle'), 500);
        }
        break;

      case 'stat_change':
      case 'status_effect':
        const statusTarget = event.target === 'player' ? this.playerAnimation : this.opponentAnimation;
        statusTarget.set('status');
        setTimeout(() => statusTarget.set('idle'), 800);
        break;
      
      case 'ability_trigger':
        const abilityTarget = event.target === 'player' ? this.playerAnimation : this.opponentAnimation;
        abilityTarget.set('ability');
        setTimeout(() => abilityTarget.set('idle'), 1000);
        break;
    }
  }
  
  resetAttackerAnimation(attacker: 'player' | 'opponent') {
    if (attacker === 'player') {
      this.playerAnimation.set('idle');
      this.playerAttackType.set(null);
    } else {
      this.opponentAnimation.set('idle');
      this.opponentAttackType.set(null);
    }
    this.projectile.set({ active: false, type: 'Normal', from: 'player' });
  }

  // --- Color Helpers ---
  getTypeColor(type: string): string { return this.getColors(type).bg; }
  getProjectileColor(type: string): string { return this.getColors(type).projectile; }

  private getColors(type: string): { bg: string, projectile: string } {
    const colors: {[key: string]: {bg: string, projectile: string}} = {
      Fire:     { bg: 'bg-red-500 hover:bg-red-600', projectile: 'bg-red-500' },
      Water:    { bg: 'bg-blue-500 hover:bg-blue-600', projectile: 'bg-blue-500' },
      Grass:    { bg: 'bg-green-500 hover:bg-green-600', projectile: 'bg-green-500' },
      Electric: { bg: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900', projectile: 'bg-yellow-400' },
      Rock:     { bg: 'bg-yellow-700 hover:bg-yellow-800', projectile: 'bg-yellow-700' },
      Flying:   { bg: 'bg-indigo-400 hover:bg-indigo-500', projectile: 'bg-indigo-400' },
      Normal:   { bg: 'bg-gray-500 hover:bg-gray-600', projectile: 'bg-gray-400' },
      Ghost:    { bg: 'bg-purple-700 hover:bg-purple-800', projectile: 'bg-purple-700' },
      Fighting: { bg: 'bg-orange-700 hover:bg-orange-800', projectile: 'bg-orange-700' },
      Psychic:  { bg: 'bg-pink-500 hover:bg-pink-600', projectile: 'bg-pink-500' },
      Ground:   { bg: 'bg-amber-800 hover:bg-amber-900', projectile: 'bg-amber-800' },
    };
    return colors[type] || colors['Normal'];
  }
}