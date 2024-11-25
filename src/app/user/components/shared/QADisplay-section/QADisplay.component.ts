import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'QADisplayComponent',
  standalone: true,
  imports: [
    MatIcon,
    NgIf,
    MatIconButton,
    DatePipe,
    MatTooltip,
    NgForOf
  ],
  templateUrl: './QADisplay.component.html',
  styleUrl: './QADisplay.component.css'
})
export class QADisplayComponent {
  @Input() answerText: string = 'Sample answer text...';
  @Input() userName: string = 'Username';
  @Input() createdDate: Date = new Date();
  @Input() votesCount: number = 3;
  @Input() isApproved: boolean = false;
  @Input() question: any; // Object representing the question
  @Input() answers!: any[]; // Array of answer objects

  upvote() {
    this.votesCount++;
  }

  downvote() {
    this.votesCount--;
  }
}
