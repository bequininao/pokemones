
import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Creature } from '../../models/creature.model';

@Component({
  selector: 'app-battle-hud',
  templateUrl: './battle-hud.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class BattleHudComponent {
  creature = input.required<Creature | null>();
  isPlayer = input<boolean>(false);

  hpPercentage: Signal<number> = computed(() => {
    const c = this.creature();
    if (!c || c.baseStats.maxHp === 0) return 0;
    return (c.currentHp / c.baseStats.maxHp) * 100;
  });

  hpBarClass: Signal<string> = computed(() => {
    const perc = this.hpPercentage();
    if (perc > 50) return 'bg-green-500';
    if (perc > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  });
}
