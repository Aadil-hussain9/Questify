import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-user-analytics',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule],
  templateUrl: './user-analytics.component.html',
  styleUrl: './user-analytics.component.css'
})
export class UserAnalyticsComponent {
  activityTimeline = [
    {
      type: 'question',
      description: 'New question posted by',
      user: 'John Doe',
      time: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      type: 'answer',
      description: 'Answer provided by',
      user: 'Jane Smith',
      time: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      type: 'acceptance',
      description: 'Answer accepted by',
      user: 'Mike Johnson',
      time: new Date(Date.now() - 1000 * 60 * 60)
    }
  ];

  constructor() {}

  ngOnInit() {
    // In a real app, we would fetch analytics data from the API
  }

  getActivityIconClass(type: string): string {
    switch (type) {
      case 'question':
        return 'bg-blue-100';
      case 'answer':
        return 'bg-green-100';
      case 'acceptance':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'question':
        return 'help_outline';
      case 'answer':
        return 'check_circle_outline';
      case 'acceptance':
        return 'star_outline';
      default:
        return 'info_outline';
    }
  }
}
