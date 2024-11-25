import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN = 'c_token';
const USER = 'c_user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private loggedInStatus = new BehaviorSubject<boolean>(StorageService.hasToken());
  private userName = new BehaviorSubject<string | null>(StorageService.getUserName());

  // Public observables
  isLoggedIn$ = this.loggedInStatus.asObservable();
  userName$ = this.userName.asObservable();

  constructor() {}

  // Save user data
  saveUser(user: { userId: string; userName: string }): void {
    this.clearUserData();
    window.localStorage.setItem(USER, JSON.stringify(user.userId));
    window.localStorage.setItem('userName', user.userName);

    // Update BehaviorSubjects
    this.userName.next(user.userName);
    this.loggedInStatus.next(true);
  }

  // Get username (static)
  static getUserName(): string | null {
    return window.localStorage.getItem('userName');
  }

  // Save token
  saveToken(bearerToken: any): void {
    window.localStorage.setItem(TOKEN, bearerToken);

    // Update BehaviorSubjects
    this.loggedInStatus.next(true);
  }

  // Check if user has a token
  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  // Check if user is logged in
  static isUserLoggedIn(): boolean {
    return this.hasToken();
  }

  // Get token
  static getToken(): string | null {
    return window.localStorage.getItem(TOKEN);
  }

  // Logout user
  static logout(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem('userName');
  }

  logout(): void {
    StorageService.logout();

    // Update BehaviorSubjects
    this.loggedInStatus.next(false);
    this.userName.next(null);
  }

  // Get user ID
  static getUserId(): string | null {
    const userId = this.getUser();
    return userId ? JSON.parse(userId) : null;
  }

  // Get raw user data
  static getUser(): string | null {
    return window.localStorage.getItem(USER);
  }

  // Clear user data
  private clearUserData(): void {
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem('userName');
  }
}
