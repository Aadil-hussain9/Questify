import {Component, HostListener, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NavigationEnd, Router, RouterModule} from "@angular/router";
import {StorageService} from '../../../../auth-services/storage-service/storage.service';
import {SearchQuestionComponent} from '../../search-question/search-question.component';


@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchQuestionComponent,
  ],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.css'
})
export class SidebarNavComponent implements OnInit{
  isUserLoggedIn: boolean = false;
  userName: string = 'A';
  fullUserName: string = '';
  isMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.isLoggedIn$.subscribe((status) => (this.isUserLoggedIn = status));
    this.storageService.userName$.subscribe((name) => {
      this.fullUserName = name || 'A';
      this.userName = name ? name.charAt(0).toUpperCase() : 'A';
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeMenu(); // Close the menu on navigation
      }
    });

  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.isUserLoggedIn = false;
    this.storageService.logout();
    this.closeMenu();
    this.router.navigateByUrl('/login');
  }

  goToUserProfile(): void {
    this.router.navigate(['/user/profile']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.closeMenu();
    }
  }
}
