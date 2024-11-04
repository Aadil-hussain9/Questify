import {Component, computed, inject, OnInit} from '@angular/core';
import {QuestionService} from '../../user-services/question-service/question.service';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel} from '@angular/material/form-field';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRow, MatChipsModule} from '@angular/material/chips';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatProgressSpinner, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatInput, MatInputModule} from '@angular/material/input';
import {
  MatAutocomplete, MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-question',
  standalone: true,
  imports: [
    MatCardTitle,
    MatError,
    MatDivider,
    MatCard,
    MatLabel,
    MatFormField,
    MatHint,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatChipInput,
    NgIf,
    NgForOf,
    MatButton,
    MatInputModule,
    FormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './post-question.component.html',
  styleUrl: './post-question.component.css'
})
export class PostQuestionComponent implements OnInit{
  validateForm: FormGroup | any;
  isSubmitting: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentTag = new FormControl('');
  tags : any = new FormControl([]);
  readonly allTags: string[] = ['C++', 'C', 'GoLang', 'Angular'];

  readonly filteredTags = computed(() => {
    const current = this.currentTag.getRawValue();
    return current
      ? this.allTags.filter(tag => tag.toLowerCase().includes(current))
      : this.allTags.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      // Add the new fruit to the tags control
      const tagsArray = this.tags.value || [];
      this.tags.setValue([...tagsArray, value]);
    }
    // Clear the input value
    this.currentTag.setValue('');
  }

  remove(tag: string): void {
    const tagsArray : any = this.tags.value;
    const index = tagsArray.indexOf(tag);

    if (index >= 0) {
      tagsArray.splice(index, 1);
      this.tags.setValue([...tagsArray]);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const tagsArray = this.tags.value || [];
    this.tags.setValue([...tagsArray, event.option.viewValue]);
    this.currentTag.setValue('');
  }

  constructor(private questionService : QuestionService,
              private fb : FormBuilder,
              private snackBar : MatSnackBar) {}


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title : ['',Validators.required],
      body : ['',Validators.required],
      tags : this.tags
    })
  }

  postQuestion() {
    console.log("question ",this.validateForm.value);
    this.questionService.postQuestion(this.validateForm.value).subscribe((response)=>{
      if(response.id){
        this.snackBar.open("Question Posted Successfully 👍",'Close',{duration:5000});
      }else {
        this.snackBar.open("Something went wrong 👎",'Close',{duration:5000});

      }
      this.validateForm.clear()
      console.log("response ",response)
    })
  }
}
