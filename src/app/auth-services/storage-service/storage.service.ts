import { Injectable } from '@angular/core';

const TOKEN = 'c_token';
const USER = 'c_user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  saveUser(user : any) {
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem("userName");
    window.localStorage.setItem(USER,JSON.stringify(user.userId));
    window.localStorage.setItem("userName",user.userName);
  }

  static getUserName() : any{
    return localStorage.getItem("userName");
  }

  static hasToken(){
    return this.getToken() !== null;

  }
  saveToken(bearerToken: any) {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN,bearerToken);
  }

  static isUserLoggedIn() : boolean {
    return this.getToken() !== null;
  }

  static getToken() : any {
    return localStorage.getItem(TOKEN);
  }

  static logout() {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem("userName");
  }

  static getUserId() {
    let userId = this.getUser();
    if(userId !== null){
      return JSON.parse(userId);
    }
  }

  static getUser(){
    return localStorage.getItem(USER) ? localStorage.getItem(USER) : '';
  }
}
