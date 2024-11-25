import {Component, EventEmitter, Output} from '@angular/core';
import {QuestionService} from '../../user-services/question-service/question.service';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatChip, MatChipListbox} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {RouterLink} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SearchDashboardService} from '../../user-services/search-dashboard-service/search-dashboard.service';

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
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    FormsModule,
    MatMenuItem
  ],
  templateUrl: './search-question.component.html',
  styleUrl: './search-question.component.css'
})
export class SearchQuestionComponent {
  // titleForm! : FormGroup;
  // pageNumber :number = 0;
  // questions: any[] = [];
  // total: number = 0;
  // pageNum: number = 0;

  constructor(private questionService : QuestionService,
              private fb: FormBuilder,
              private searchDashboardService: SearchDashboardService) {

    // this.titleForm = this.fb.group({
    //   title : [null,Validators.required]
    // })
  }

  // searchQuestionByTitle(){
  //   console.log("title ",this.titleForm.getRawValue().title)
  //   this.questionService.searchQuestionByTitle(this.titleForm.getRawValue().title , this.pageNumber)
  //     .subscribe((response:any)=>{
  //       this.questions = response.questionDtoList;
  //       this.pageNumber = response.totalPages;
  //       this.total = response.totalPages
  //   })
  // }
  //
  // pageIndexChange(event: any) {
  //   this.pageNum = event.pageIndex;
  //   this.searchQuestionByTitle();
  // }
  @Output() search = new EventEmitter<{ type: string; query: string }>();

  searchQuery = '';
  selectedType = 'title';
  searchTypes:any = [
    { value: 'title', label: 'Search by Title', icon: 'title' },
    { value: 'tag', label: 'Search by Tag', icon: 'label' },
    { value: 'user', label: 'Search by User', icon: 'person' }
  ];

  // Dummy suggestions for demonstration
  suggestions:any = {
    title: ['How to use Angular', 'What is TypeScript', 'Understanding RxJS'],
    tag: ['angular', 'typescript', 'rxjs', 'material'],
    user: ['JohnDoe', 'JaneSmith', 'AngularDev']
  };

  onSearch() {
    if (this.searchQuery.trim()) {
      const searchData = {
        type: this.selectedType,
        query: this.searchQuery.trim()
      };

      // Emit the event
      this.search.emit(searchData);

      // Update the shared service
      this.searchDashboardService.updateSearchData(searchData);
    }
  }

  setSearchType(type: string) {
    this.selectedType = type;
  }

  getPlaceholder(): string {
    switch (this.selectedType) {
      case 'tag':
        return 'Search by tag (e.g., angular, typescript)';
      case 'user':
        return 'Search by username';
      default:
        return 'Search questions by title';
    }
  }

  getSuggestions(): string[] {
    return this.suggestions[this.selectedType]?.filter((suggestion: string) =>
      suggestion.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSuggestionClick(suggestion: string) {
    this.searchQuery = suggestion;
    this.onSearch();
  }

  getSelectedType(type: string) {
    if(type === 'icon') {
      const type = this.searchTypes.find((t:any) => t.value === this.selectedType);
      return type ? type.icon : 'help_outline';
    }else {
      const type = this.searchTypes.find((t:any) => t.value === this.selectedType);
      return type ? type.label : 'help_outline';
    }
  }
}
