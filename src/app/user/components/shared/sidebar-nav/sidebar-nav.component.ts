import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {StorageService} from '../../../../auth-services/storage-service/storage.service';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatToolbar,
    NgIf,
    RouterLink,
    RouterLinkActive,
    MatMenuTrigger
  ],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.css'
})
export class SidebarNavComponent implements OnInit{
  title = 'stackoverflow-frontend';

  isUserLoggedIn:boolean = false;
  userName: string = '';

  constructor(private router : Router) {
  }

  updateUserLoggedInStatus(){
    this.isUserLoggedIn = StorageService.isUserLoggedIn();
    this.userName = StorageService.getUserName() ? StorageService.getUserName().charAt(0).toUpperCase() : 'A';
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        // this.updateUserLoggedInStatus();
        console.log("Navigation has ended. Current URL:", event.url);
      }
    })
  }

  ngOnInit(): void {
    this.updateUserLoggedInStatus();
  }

  logout() {
    StorageService.logout();
    this.router.navigateByUrl('/login').then(()=>console.log("User Logged Out Success"));
  }

  toggleDropdown() {

  }

}
