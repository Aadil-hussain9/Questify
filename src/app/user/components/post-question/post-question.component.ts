import {Component, computed, inject, OnInit} from '@angular/core';
import {QuestionService} from '../../user-services/question-service/question.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIcon} from '@angular/material/icon';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SpinnerService} from '../../user-services/shared-service/spinner-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule
  ],
  animations: [
    trigger('panelAnimation', [
      state('open', style({ height: '*', opacity: 1 })),
      state('closed', style({ height: '0px', opacity: 0 })),
      transition('open <=> closed', [animate('300ms ease-in-out')]),
    ]),
  ],
  templateUrl: './post-question.component.html',
  styleUrl: './post-question.component.css'
})
export class PostQuestionComponent implements OnInit{
  validateForm: FormGroup | any;
  isSubmitting: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentTag = new FormControl('');
  tags: any = new FormControl([]);
  readonly allTags: string[] = ['C++', 'C', 'GoLang', 'Angular'];

  readonly filteredTags = computed(() => {
    const current = this.currentTag.getRawValue();
    return current
      ? this.allTags.filter(tag => tag.toLowerCase().includes(current))
      : this.allTags.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinnerService:SpinnerService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      tags: this.tags
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const tagsArray = this.tags.value || [];
      this.tags.setValue([...tagsArray, value]);
    }
    this.currentTag.setValue('');
  }

  removeTag(tag: string): void {
    const tagsArray: any = this.tags.value;
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

  submitQuestion() {
    this.spinnerService.showSpinner('Submitting your question...');
    if (this.validateForm.valid) {
      this.isSubmitting = true;
      this.questionService.postQuestion(this.validateForm.value).subscribe({
        next: (response) => {
          if (response.id) {
            this.snackBar.open("Question Posted Successfully 👍", 'Close', { duration: 5000 });
            this.validateForm.reset();
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open("Something went wrong 👎", 'Close', { duration: 5000 });
          }
        },
        error: () => {
          this.snackBar.open("Error posting question 👎", 'Close', { duration: 5000 });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
