import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../auth-services/auth-service/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Route, Router} from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatLabel,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{

  signupForm : FormGroup | any;

  constructor(private fb :FormBuilder,
              private authService : AuthService,
              private snakBar : MatSnackBar,
              private router : Router) {

  }

  signUp() {
    console.log(this.signupForm.value)
    this.authService.signUp(this.signupForm.value).subscribe((response)=>{
      console.log(response)
      if(response.name != null){
        this.snakBar.open("Yay! registered successfully",
          'Close',
          {duration:5000});
        this.router.navigateByUrl('/login').then(() => {
          console.log('Navigation successful, clearing form data...');
          this.signupForm.clear;
        });
      }else {
        this.snakBar.open(response.message , 'Close',{duration:5000})
      }
    },error => {
      this.snakBar.open("Registration failed please try again later",'Close',{duration:5000})
    })
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required],
      confirmPassword:['',Validators.required],},
    {validator: this.confirmValidator})
  }

  confirmValidator(fg :FormGroup) {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    if(password != confirmPassword){
      fg.get('confirmPassword')?.setErrors({passwordMismatch:true});
    }else {
      fg.get('confirmPassword')?.setErrors(null);
    }
  }
}
