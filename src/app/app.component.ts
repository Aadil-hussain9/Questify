import {Component, OnInit} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {StorageService} from './auth-services/storage-service/storage.service';
import {NgIf} from '@angular/common';
import {MatSidenav} from '@angular/material/sidenav';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {SidebarNavComponent} from './user/components/shared/sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSlideToggleModule, RouterOutlet, MatToolbar, RouterLink, MatButton, RouterLinkActive, NgIf, MatSidenav, MatMenu, MatIcon, MatIconButton, MatMenuItem, MatMenuTrigger, SidebarNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

}
