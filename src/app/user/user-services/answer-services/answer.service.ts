import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from '../../../auth-services/storage-service/storage.service';
import {Observable, map} from 'rxjs';
import {UserLeaderBoardResponse} from '../../components/shared/dtos/leaderBoardResponse';

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

    getUserLeaderBoard():Observable<UserLeaderBoardResponse>{
      const uri = BASIC_URL+`api/user-leaderboard`;
      return this.http.get<UserLeaderBoardResponse>(uri,{
        headers:this.createAuthorizationHeader()
      });
    }

  getUserProfileDetails():Observable<any>{
    const userId:any = StorageService.getUserId();
    const uri = BASIC_URL+`api/user-details/${userId}`;
    return this.http.get<UserLeaderBoardResponse>(uri,{
      headers:this.createAuthorizationHeader()
    }).pipe(map((response:any) =>{
      if(response.photoUrl){
        response.photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?${response.photoUrl}`;
      }
      return response;
    }));
  }

  private createAuthorizationHeader() : HttpHeaders {
    let authHeaders:HttpHeaders = new HttpHeaders();
    return authHeaders.set("Authorization","Bearer"+StorageService.getToken())
  }
}
