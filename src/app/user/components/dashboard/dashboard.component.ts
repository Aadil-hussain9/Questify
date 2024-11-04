import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../user-services/question-service/question.service';
import {MatCard, MatCardContent, MatCardModule} from '@angular/material/card';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatChip, MatChipListbox, MatChipsModule} from '@angular/material/chips';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatTooltip} from '@angular/material/tooltip';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCard,
    MatCardModule,
    MatIconModule,
    MatChipListbox,
    NgForOf,
    MatChipsModule,
    MatPaginatorModule,
    MatButtonModule,
    NgIf,
    DatePipe,
    RouterLink,
    MatRadioGroup,
    MatRadioButton,
    MatTooltip,
    NgStyle,
    MatCheckbox
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  pageNum: number = 0;
  total: number = 0;
  questions: any[] = [];

  constructor(private questionService : QuestionService) {
  }

  getAllQuestions(sortParam?:string){
    this.questionService.getAllQuestions(this.pageNum,sortParam).subscribe((response:any) =>{
      console.log("response ",response);
      this.questions = response.questionDtoList;
      this.total = response.totalPages * 5;
    })
  }

  ngOnInit(): void {
    this.getAllQuestions();
  }

  pageIndexChange(event: PageEvent) {
    this.pageNum = event.pageIndex;
    this.getAllQuestions();
  }

  getLatestQuestions() {
    this.getAllQuestions("date")
  }

  getMyQuestionsOnly(event: MatCheckboxChange){
    if (event.checked) {
      this.questionService.getQuestionsByUserId(this.pageNum).subscribe((response:any) =>{
        console.log("response ",response);
        this.questions = []
        this.questions = response.questionDtoList;
        this.total = response.totalPages * 5;
      })
    } else {
      this.getAllQuestions();
    }
  }

  getFormattedDate(datePosted: string | Date): string {
    return this.questionService.getFormattedDate(datePosted);
  }
}
