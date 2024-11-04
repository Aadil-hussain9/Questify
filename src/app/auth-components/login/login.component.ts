import {Component, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {AuthService} from '../../auth-services/auth-service/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatLabel,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm : FormGroup | any;
  constructor(private authService : AuthService,
              private fb : FormBuilder,
              private router : Router,
              private snackbar : MatSnackBar) {
  }

  login() {
    console.log(this.loginForm.value)
    this.authService.login(this.loginForm.value).subscribe((response:any)=>{
      console.log(response.userId)
      this.router.navigateByUrl("user/dashboard").then(()=>{
        console.log("login success , Navigating to user dashboard");
      });
      this.snackbar.open("Login Success","Close",{duration:100});
    },error => {
      debugger
      this.snackbar.open("Bad Credentials","Close",{duration:5000, panelClass:'error-snackbar'})
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required],
    })
  }
}
