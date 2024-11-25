import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {LeaderboardCardComponent} from '../shared/leaderboard-card/leaderboard-card.component';
import {UserRankComponent} from '../shared/user-rank/user-rank.component';

@Component({
  selector: 'app-user-champions',
  standalone: true,
  imports: [
    NgForOf,
    LeaderboardCardComponent,
    UserRankComponent
  ],
  templateUrl: './user-champions.component.html',
  styleUrl: './user-champions.component.css'
})
export class UserChampionsComponent {
  categories = [
    'Overall Champions',
    'Most Helpful in Java',
    'Fastest Responders',
    'Top Monthly Contributors',
    'Best Explanations'
  ];
  selectedCategory = 'Overall Champions';

  timePeriods = ['This Week', 'This Month', 'All Time'];
  selectedPeriod = 'This Month';

  users = [
    {
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      points: 2840,
      badges: ['🏆', '⚡', '🎯'],
      streak: 45,
      responseTime: '2m',
      helpfulCount: 386,
      level: 32
    },
    {
      name: 'Alex Kumar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      points: 2560,
      badges: ['🌟', '💡', '🎯'],
      streak: 38,
      responseTime: '3m',
      helpfulCount: 342,
      level: 28
    },
    {
      name: 'Maria Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      points: 2320,
      badges: ['🌟', '⚡'],
      streak: 29,
      responseTime: '4m',
      helpfulCount: 295,
      level: 25
    },
    {
      name: 'James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      points: 2150,
      badges: ['💡', '🎯'],
      streak: 25,
      responseTime: '3m',
      helpfulCount: 276,
      level: 23
    },
    {
      name: 'Emma Thompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      points: 1980,
      badges: ['⚡'],
      streak: 21,
      responseTime: '5m',
      helpfulCount: 245,
      level: 21
    }
  ];

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Here you would typically fetch new data based on the category
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    // Here you would typically fetch new data based on the time period
  }

  getTopUsers() {
    return this.users.slice(0, 3);
  }

  getRemainingUsers() {
    return this.users.slice(3);
  }

  getCurrentUser() {
    return {
      name: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      points: 1750,
      badges: ['🌟'],
      streak: 15,
      responseTime: '4m',
      helpfulCount: 185,
      level: 18
    };
  }

  getUserPosition() {
    return 8;
  }
}
