import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../auth-services/auth-service/auth.service';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {
  AvatarSelectionDialogComponent
} from '../../user/components/user-profile/avtars/avatar-selection-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  //
  // signupForm: FormGroup | any;
  //
  // constructor(
  //   private fb: FormBuilder,
  //   private authService: AuthService,
  //   private snakBar: MatSnackBar,
  //   private router: Router
  // ) {}
  //
  // ngOnInit(): void {
  //   this.signupForm = this.fb.group({
  //     name: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //     confirmPassword: ['', Validators.required]
  //   }, { validator: this.confirmValidator });
  // }
  //
  // confirmValidator(fg: FormGroup) {
  //   const password = fg.get('password')?.value;
  //   const confirmPassword = fg.get('confirmPassword')?.value;
  //   if (password !== confirmPassword) {
  //     fg.get('confirmPassword')?.setErrors({ passwordMismatch: true });
  //   } else {
  //     fg.get('confirmPassword')?.setErrors(null);
  //   }
  // }
  //
  // signUp() {
  //   if (this.signupForm.valid) {
  //     this.authService.signUp(this.signupForm.value).subscribe({
  //       next: (response) => {
  //         if (response.name != null) {
  //           this.snakBar.open(
  //             "Yay! registered successfully",
  //             'Close',
  //             { duration: 5000 }
  //           );
  //           this.router.navigateByUrl('/login').then(() => {
  //             console.log('Navigation successful, clearing form data...');
  //             this.signupForm.reset();
  //           });
  //         } else {
  //           this.snakBar.open(response.message, 'Close', { duration: 5000 });
  //         }
  //       },
  //       error: () => {
  //         this.snakBar.open(
  //           "Registration failed please try again later",
  //           'Close',
  //           { duration: 5000 }
  //         );
  //       }
  //     });
  //   }
  // }
  //
  //
  //

  currentStep = 1;
  signupForm: FormGroup | any;
  isSubmitting = false;
  submitSuccess = false;

  steps:any = [
    { id: 1, label: 'Account', icon: 'account_circle' }, // Material Icons
    { id: 2, label: 'Details', icon: 'info' },
    { id: 3, label: 'Finish', icon: 'check' },
  ];

  constructor(
    private fb: FormBuilder,
    private signupService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      // Step 1
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],

      // Step 2
      country: ['', Validators.required],
      state: ['', Validators.required],
      avatar: [''],
      designation: ['',Validators.required],

      // Step 3
      skills: this.fb.array([]),

      // Step 4
      bio: ['', [Validators.maxLength(500)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.addSkill();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  isStepValid(step: number): boolean | any {
    switch (step) {
      case 1:
        return this.signupForm.get('email')?.valid &&
          this.signupForm.get('name')?.valid &&
          this.signupForm.get('password')?.valid &&
          this.signupForm.get('confirmPassword')?.valid &&
          !this.signupForm.hasError('mismatch');
      case 2:
        return this.signupForm.get('country')?.valid &&
          this.signupForm.get('state')?.valid &&
          this.signupForm.get('designation')?.valid;
      case 3:
        return true;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep) && this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addSkill(): void {
    const skills = this.signupForm.get('skills') as FormArray;
    if(skills.length <3){
    skills.push(this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required]
    }));
    }else {
      console.error("only three skills")
    }
  }
  removeSkill(){
    const skills = this.signupForm.get('skills') as FormArray;
    if(skills.length >1){
      skills.removeAt(skills.length - 1);
    }else {
      console.error("only three skills")
    }
  }


  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isSubmitting = true;
      const profileDTO = this.mapToProfileDTO(this.signupForm.value);
      console.log("dto .... ",profileDTO)
      this.signupService.signUp(profileDTO).subscribe({
        next: (response:any) => {
          this.submitSuccess = true;
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigateByUrl('/login').then(() => {
              console.log('Navigation successful, clearing form data...');
              this.signupForm.reset();
            });
          }, 2000); // 5000ms = 5 seconds
        },
        error: (error) => {
          this.isSubmitting = false;
        }
      });
    }
  }

  openAvatarDialog() {
      const dialogRef =
        this.dialog.open(AvatarSelectionDialogComponent, {
          width: '500px',
          data: { selectedAvatar: this.signupForm.get('avatar')?.value },
        });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.signupForm.get('avatar')?.setValue(result);
        }
      });
  }

  private mapToProfileDTO(formValue: any) : ProfileDto {
    return {
      email: formValue.email,
      name: formValue.name,
      password:formValue.password,
      photoUrlSeed: this.getSeedFromAvatarUrl(formValue.avatar),
      designation: formValue.designation,
      location: `${formValue.state}, ${formValue.country}`,
      skills: formValue.skills,
      bio: formValue.bio,
    };
  }

  getSeedFromAvatarUrl(url: string): string {
    const match = url.match(/seed=[^&]+(.*)$/); // Match seed and everything after it
    return match ? match[0] : ''; // Return the full st
  }
}

export interface Skill {
  name: string;
  level: number;
}

export interface ProfileDto {
  photoUrlSeed: string;
  name: string;
  email: string;
  password:string;
  designation: string;
  location: string;
  skills: Skill[];
  bio: string;
}


