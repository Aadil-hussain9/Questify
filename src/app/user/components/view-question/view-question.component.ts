import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuestionService} from '../../user-services/question-service/question.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatChip, MatChipListbox} from '@angular/material/chips';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AnswerService} from '../../user-services/answer-services/answer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../../auth-services/storage-service/storage.service';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-view-question',
  standalone: true,
  imports: [
    MatChipListbox,
    NgForOf,
    MatChip,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    NgIf,
    NgClass,
    MatIcon,
    MatIconButton,
    MatTooltip,
    QuillModule,
    FormsModule
  ],
  templateUrl: './view-question.component.html',
  styleUrl: './view-question.component.css'
})
export class ViewQuestionComponent implements OnInit {

  questionId: number = -1
  question: any = [];
  validateForm: FormGroup | any;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  formData: FormData = new FormData();
  answers: any[] = [];
  currentUserId: any = '';

  constructor(private questionService: QuestionService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private answerService: AnswerService,
              private snackBar: MatSnackBar,
              private storageService: StorageService) {
    this.validateForm = this.fb.group({
      body: [null, Validators.required]
    })
  }

  ngOnInit() {
    this.questionId = this.activatedRoute.snapshot.params ["questionId"];
    this.getQuestionById();
    this.incrementViewCount();
      this.currentUserId = StorageService.getUserId();
  }

  getQuestionById() {
    this.questionService.getQuestionById(this.questionId).subscribe((response: any) => {
      this.question = response.questionDto;
      this.answers = [];
      response.answerDtoList.forEach((element: any) => {
        if (element.file != null) {
          element.convertedImg = 'data:image/jpeg;base64,' + element.file.data;
        }
        this.answers.push(element);
      });

    })
  }

  addAnswer() {
    this.validateForm.value.questionId = this.questionId;
    if (this.selectedFile) {
      this.formData.append("multipartFile", this.selectedFile);
    }
    this.answerService.postAnswer(this.validateForm.value).subscribe(response => {
      console.log(response)
      debugger
      console.log(this.formData.get("multipartFile"));
      this.answerService.postAnswerImage(this.formData, response.id).subscribe(imageRes => {
          console.log("image saved ", imageRes)
          this.snackBar.open("Image Posted successfully", 'Close', {duration: 5000})
        },
        error => {
          console.error("Error saving image", error);
          this.snackBar.open("Something went wrong", 'Close', {duration: 5000})
        })
      if (response.id) {
        this.snackBar.open("Answer Posted successfully", 'Close', {duration: 5000})
      }
    }, error => {
      this.snackBar.open("Something went wrong", 'Close', {duration: 5000})
    })
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; // this should set the image preview URL correctly
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addVoteToQuestion(voteType: string, voted: any) {
    if (voted == 0) {
      const data = {
        voteType: voteType,
        questionId: this.questionId
      }
      this.questionService.addVoteToQuestion(data).subscribe(response => {
        console.log("Vote ", response)
        if (response.id) {
          this.getQuestionById();
          this.snackBar.open("Voted Success 👍", 'Close', {duration: 5000});
        }
      }, error => {
        this.snackBar.open("Something went wrong", 'Close', {duration: 5000});
      })
    } else {
      this.snackBar.open("You have already Voted", 'Close', {duration: 5000, panelClass: 'error-snackbar'});
    }
  }


  approveAnswer(answerId: number) {
    debugger
    this.answerService.approveAnswer(answerId).subscribe(response => {
      if (response == true) {
        this.snackBar.open("Approved 👍", 'Close', {duration: 5000});
        this.getQuestionById();
      } else {
        this.snackBar.open("Something Went wrong", 'Close', {duration: 5000});
      }
    })
  }

  addVoteToAnswer(voteType: string, answerId: any, voted: number) {
    if (voted == 0) {
      const answerData = {
        voteType: voteType,
        answerId: answerId
      }
      this.questionService.addVoteToAnswer(answerData).subscribe(response => {
        console.log("Vote ", response)
        if (response) {
          this.getQuestionById();
          this.snackBar.open("Voted Success 👍", 'Close', {duration: 5000});
        }
      }, error => {
        this.snackBar.open("Something went wrong", 'Close', {duration: 5000});
      })
    } else {
      this.snackBar.open("You Have Already Voted", 'Close', {duration: 5000});
    }
  }

  addCommentToAnswer(comment: HTMLInputElement, answerId: number) {
    console.log("Comment ", comment.value)
    this.questionService.addCommentToAnswer(comment.value, answerId).subscribe((response: any) => {
      if (response.body) {
        this.answers = [];
        this.getQuestionById();
        this.snackBar.open("comment Added", 'Close', {duration: 5000});
      }
    }, error => {
      this.snackBar.open("Something went wrong", 'Close', {duration: 5000});
    })
  }

  incrementViewCount() {
    this.questionService.incrementViewCount(this.questionId).subscribe();
  }

  getFormattedDate(datePosted: string | Date): string {
    return this.questionService.getFormattedDate(datePosted);
  }
}
