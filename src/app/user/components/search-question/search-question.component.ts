import { Component } from '@angular/core';
import {QuestionService} from '../../user-services/question-service/question.service';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatChip, MatChipListbox} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-search-question',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatButton,
    ReactiveFormsModule,
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
  templateUrl: './search-question.component.html',
  styleUrl: './search-question.component.css'
})
export class SearchQuestionComponent {
  titleForm! : FormGroup;
  pageNumber :number = 0;
  questions: any[] = [];
  total: number = 0;
  pageNum: number = 0;

  constructor(private questionService : QuestionService,
              private fb: FormBuilder) {

    this.titleForm = this.fb.group({
      title : [null,Validators.required]
    })
  }

  searchQuestionByTitle(){
    console.log("title ",this.titleForm.getRawValue().title)
    this.questionService.searchQuestionByTitle(this.titleForm.getRawValue().title , this.pageNumber)
      .subscribe((response:any)=>{
        this.questions = response.questionDtoList;
        this.pageNumber = response.totalPages;
        this.total = response.totalPages
    })
  }

  pageIndexChange(event: any) {
    this.pageNum = event.pageIndex;
    this.searchQuestionByTitle();
  }
}
