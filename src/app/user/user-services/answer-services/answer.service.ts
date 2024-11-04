import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from '../../../auth-services/storage-service/storage.service';
import {Observable} from 'rxjs';

const BASIC_URL= ['http://localhost:8080/'];

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http:HttpClient) { }

  postAnswer(answerDto:any):Observable<any>{
    answerDto.userId = StorageService.getUserId();
    const uri = BASIC_URL+'api/answer';
    return this.http.post(uri,answerDto , {
      headers:this.createAuthorizationHeader()
    });
  }

  approveAnswer(answerId:number):Observable<any>{
    const uri = BASIC_URL+`api/answer/approve/${answerId}`;
    return this.http.get(uri,{
      headers:this.createAuthorizationHeader()
    });
  }

    postAnswerImage(file:any, answerId:number):Observable<any>{
      const uri = BASIC_URL+ `api/answer/image/${answerId}`;
      return this.http.post(uri,file , {
        headers:this.createAuthorizationHeader(), responseType: 'text' as 'json'
      });
    }

  private createAuthorizationHeader() : HttpHeaders {
    let authHeaders:HttpHeaders = new HttpHeaders();
    return authHeaders.set("Authorization","Bearer"+StorageService.getToken())
  }
}
