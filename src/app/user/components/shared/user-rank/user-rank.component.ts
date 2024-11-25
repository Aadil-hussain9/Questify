import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-rank',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg p-4 shadow transition-all"
         [class.border-2]="isCurrentUser"
         [class.border-indigo-500]="isCurrentUser">
      <div class="flex items-center gap-4">
        <!-- Position -->
        <div [class]="getPositionClass()">
          {{ position }}
        </div>

        <!-- Avatar -->
        <div class="relative">
          <img [src]="user.avatar"
               [alt]="user.name"
               class="w-12 h-12 rounded-full">
          <div class="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5">
            <div class="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              {{ user.level }}
            </div>
          </div>
        </div>

        <!-- User Info -->
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <h6 class="font-semibold text-gray-800">{{ user.name }}</h6>
            <span *ngFor="let badge of user.badges"
                  class="text-lg"
                  [title]="getBadgeTitle(badge)">
              {{ badge }}
            </span>
          </div>
          <div class="text-sm text-gray-600">{{ user.points.toLocaleString() }} points</div>
        </div>

        <!-- Stats -->
        <div class="flex gap-6 text-sm text-gray-600">
          <div>
            <span class="font-medium">{{ user.streak }}d</span> streak
          </div>
          <div>
            <span class="font-medium">{{ user.responseTime }}</span> avg
          </div>
          <div>
            <span class="font-medium">{{ user.helpfulCount }}</span> helpful
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserRankComponent {
  @Input() user: any;
  @Input() position!: number;
  @Input() isCurrentUser = false;

  getPositionClass() {
    return 'w-8 h-8 rounded-full flex items-center justify-center font-bold ' +
      (this.position <= 3 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700');
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
