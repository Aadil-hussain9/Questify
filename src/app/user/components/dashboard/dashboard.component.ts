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
import {SearchDashboardService} from '../../user-services/search-dashboard-service/search-dashboard.service';
import {SpinnerService} from '../../user-services/shared-service/spinner-service.service';

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

  constructor(private questionService : QuestionService,
              private searchService : SearchDashboardService,
              private spinnerService : SpinnerService) {
  }

  getAllQuestions(sortParam?:string){
    this.spinnerService.showSpinner('Loading questions...');
    this.questionService.getAllQuestions(this.pageNum,sortParam).subscribe((response:any) =>{
      console.log("response ",response);
      this.questions = response.questionDtoList;
      this.total = response.totalPages * 5;
    })
  }

  ngOnInit(): void {
    this.searchService.searchData$.subscribe((searchData) => {
      if (searchData) {
        this.fetchDashboardData(searchData);
      }
    });
    this.getAllQuestions();
  }

  pageIndexChange(event: PageEvent) {
    this.pageNum = event.pageIndex;
    this.getAllQuestions();
  }

  getLatestQuestions() {
    this.getAllQuestions("date")
  }

  getMyQuestionsOnly(event: any){
    this.spinnerService.showSpinner('Loading your question...');
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

  fetchDashboardData(searchData: { type: string; query: string }) {
    // this.loading = true;

    this.spinnerService.showSpinner('Loading searched question...');
    // Call the backend API with search data
    this.questionService.searchQuestionByTitle(searchData.query , this.pageNum)
      .subscribe((response:any)=>{
        this.questions = response.questionDtoList;
        this.pageNum = response.totalPages;
        this.total = response.totalPages
      })
  }
}
