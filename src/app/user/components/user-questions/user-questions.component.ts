import { Component } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {RouterLink} from "@angular/router";
import {QuestionService} from '../../user-services/question-service/question.service';

@Component({
  selector: 'app-user-questions',
  standalone: true,
    imports: [
        DatePipe,
        MatCard,
        MatCardContent,
        MatChip,
        MatChipListbox,
        MatIcon,
        MatPaginator,
        NgForOf,
        NgIf,
        RouterLink
    ],
  templateUrl: './user-questions.component.html',
  styleUrl: './user-questions.component.css'
})
export class UserQuestionsComponent {
  pageNum: number = 0;
  total: number = 0;
  questions: any[] = [];

  constructor(private questionService : QuestionService) {
  }

  getAllQuestions(){
    this.questionService.getQuestionsByUserId(this.pageNum).subscribe((response:any) =>{
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
}
