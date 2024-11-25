import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Position Badge -->
      <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div [class]="getPositionClass()">
          {{ position }}
        </div>
      </div>

      <!-- Card Content -->
      <div class="bg-white rounded-lg shadow-lg p-4 text-center relative overflow-hidden">
        <!-- Glow Effect -->
        <div *ngIf="position === 1"
             class="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 opacity-20">
        </div>

        <!-- Avatar -->
        <div class="relative inline-block">
          <img [src]="user.avatar"
               [alt]="user.name"
               class="w-20 h-20 rounded-full mx-auto mb-3 border-4"
               [class]="getBorderClass()">
          <div class="absolute -right-1 -bottom-1 bg-white rounded-full p-1">
            <div [class]="getLevelBadgeClass()">
              {{ user.level }}
            </div>
          </div>
        </div>

        <!-- User Info -->
        <h6 class="font-bold text-gray-800 mb-1">{{ user.name }}</h6>
        <div class="text-sm text-gray-600 mb-2">{{ user.points.toLocaleString() }} points</div>

        <!-- Badges -->
        <div class="flex justify-center gap-1 mb-3">
          <span *ngFor="let badge of user.badges"
                class="text-xl"
                [title]="getBadgeTitle(badge)">
            {{ badge }}
          </span>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-2 text-xs text-gray-600">
          <div>
            <div class="font-semibold">Streak</div>
            <div class="text-indigo-600">{{ user.streak }} days</div>
          </div>
          <div>
            <div class="font-semibold">Avg Response</div>
            <div class="text-indigo-600">{{ user.responseTime }}</div>
          </div>
          <div>
            <div class="font-semibold">Helpful</div>
            <div class="text-indigo-600">{{ user.helpfulCount }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaderboardCardComponent {
  @Input() user: any;
  @Input() position!: string | number;

  getPositionClass() {
    const baseClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold';
    switch (this.position) {
      case 1:
        return `${baseClass} bg-yellow-500 shadow-lg`;
      case 2:
        return `${baseClass} bg-gray-400`;
      case 3:
        return `${baseClass} bg-amber-600`;
      default:
        return `${baseClass} bg-gray-300`;
    }
  }

  getBorderClass() {
    switch (this.position) {
      case 1:
        return 'border-yellow-500';
      case 2:
        return 'border-gray-400';
      case 3:
        return 'border-amber-600';
      default:
        return 'border-gray-300';
    }
  }

  getLevelBadgeClass() {
    return 'w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center';
  }

  getBadgeTitle(badge: string) {
    const titles: { [key: string]: string } = {
      '🏆': 'Champion',
      '⚡': 'Fast Responder',
      '💡': 'Problem Solver',
      '🌟': 'Rising Star',
      '🎯': 'Accurate Helper'
    };
    return titles[badge] || 'Achievement Badge';
  }
}
