import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {QuestionService} from '../../../user-services/question-service/question.service';
import {MatChip} from '@angular/material/chips';

@Component({
  selector: 'app-user-submissions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChip
  ],
  templateUrl: './user-submissions.component.html',
  styleUrl: './user-submissions.component.css'
})
export class UserSubmissionsComponent implements OnInit {
  stats = {
    totalQuestions: 0,
    totalAnswers: 0,
    avgResponseTime: 0
  };
  recentQuestions: any = [];

  constructor(
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.questionService.getQuestionsByUserId(1)
      .subscribe(questions => this.recentQuestions = questions);
    this.stats = {
      totalQuestions: 142,
      totalAnswers: 897,
      avgResponseTime: 15
    };
  }
}
