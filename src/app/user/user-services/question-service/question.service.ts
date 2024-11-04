import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StorageService} from '../../../auth-services/storage-service/storage.service';

const BASIC_URL= ['http://localhost:8080/'];
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http:HttpClient) { }

  postQuestion(questionDto:any):Observable<any>{
    questionDto.userId = JSON.stringify(StorageService.getUserId());
    const uri = BASIC_URL+'api/question';
    return this.http.post(uri,questionDto , {
      headers:this.createAuthorizationHeader()
    });
  }

  addVoteToQuestion(VoteQuestionDto:any):Observable<any>{
    VoteQuestionDto.userId = StorageService.getUserId();
    const uri = BASIC_URL+'api/vote';
    return this.http.post(uri,VoteQuestionDto , {
      headers:this.createAuthorizationHeader()
    });
  }

  getAllQuestions(pageNumber: number, sortParam?: string) {
    let params = new HttpParams().set('pageNumber', pageNumber.toString());

    // Only add the 'sort' parameter if it's provided
    if (sortParam) {
      params = params.set('sort', sortParam);
    }

    const uri = `${BASIC_URL}api/question/questions/${pageNumber}`;

    return this.http.get(uri, {
      headers: this.createAuthorizationHeader(),
      params: params // Add the params object here to include query parameters
    });
  }

  incrementViewCount(questionId: number) {
    debugger
    const uri = `http://localhost:8080/api/question/incrementView/${questionId}`
    return this.http.put(uri, {},
      {headers:this.createAuthorizationHeader()});
  }

  getQuestionById(questionId : number){
    debugger
    let id  = StorageService.getUserId();
    const uri = BASIC_URL+`api/question/${questionId}/${StorageService.getUserId()}`;
    return this.http.get(uri , {headers:this.createAuthorizationHeader()})
  }

  getQuestionsByUserId(pageNumber : number){
    const uri = BASIC_URL+`api/question/questions/${StorageService.getUserId()}/${pageNumber}`;
    return this.http.get(uri , {headers:this.createAuthorizationHeader()})
  }

  searchQuestionByTitle(title :string, pageNumber : number){
    const uri = BASIC_URL+`api/question/search/${title}/${pageNumber}`;
    return this.http.get(uri , {headers:this.createAuthorizationHeader()})
  }
  createAuthorizationHeader() : HttpHeaders {
    let authHeaders:HttpHeaders = new HttpHeaders();
    return authHeaders.set("Authorization","Bearer"+StorageService.getToken())
  }

  addVoteToAnswer(answerData: any) {
    answerData.userId = StorageService.getUserId();
    const uri = BASIC_URL+'api/answer-vote';
    return this.http.post(uri,answerData, {
      headers:this.createAuthorizationHeader()
    });
  }

  addCommentToAnswer(comment: string,answerId:number) {
    const commentData = {
    body:comment,
    answerId:answerId,
    userId:StorageService.getUserId()
    }
    const uri = BASIC_URL+'api/answer/answer-comment';
    return this.http.post(uri,commentData, {
      headers:this.createAuthorizationHeader()
    });
  }

  getFormattedDate(datePosted: string | Date): string {
    const currentDate = new Date();
    const inputDate = new Date(datePosted);
    const diffInMs = currentDate.getTime() - inputDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    }else if (diffInDays < 10) {
      return `${diffInDays} days ago`;
    } else {
      // Format to "yyyy-MM-dd" for dates older than 10 days
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
}
