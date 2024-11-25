import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {StorageService} from '../storage-service/storage.service';
import {SignupData} from '../../auth-components/shared/sign-up-dto';
import {delay} from 'rxjs/operators';
import {ProfileDto} from '../../auth-components/signup/signup.component';

const BASIC_URL= ['http://localhost:8080/'];
export const AUTH_HEADER = "authorization";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,
              private storage:StorageService) { }

  signUp(signupRequest:any):Observable<any>{
    return this.http.post(BASIC_URL+"signup",signupRequest)
  }

  login(loginRequest:any):Observable<any>{
    debugger
    return this.http.post(BASIC_URL+"authentication",loginRequest ,{observe:'response'})
      .pipe(tap(__=> this.log("user Authentication")),
      map((res:HttpResponse<any>)=>{
        debugger
        this.storage.saveUser(res.body);
        const tokenLength = res.headers.get(AUTH_HEADER)?.length;
        const bearerToken = res.headers.get(AUTH_HEADER)?.substring(6,tokenLength);
        this.storage.saveToken(bearerToken);
        return res.body;
      }))
  }

   log(message: string) {
    console.log("user auth service ",message)
  }

  submitSignupData(data: ProfileDto): Observable<any> {
    // Simulating API call with delay
    return of({ success: true, message: 'Registration successful!' }).pipe(
      delay(1000)
    );
  }
}
