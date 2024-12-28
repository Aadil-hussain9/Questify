import {Component, OnInit} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {RouterOutlet} from '@angular/router';
import {SidebarNavComponent} from './user/components/shared/sidebar-nav/sidebar-nav.component';
import {NgxSpinnerComponent, NgxSpinnerService} from 'ngx-spinner';
import {SpinnerService} from './user/user-services/shared-service/spinner-service.service';
import { BannerComponent } from './user/components/banner/banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSlideToggleModule, RouterOutlet, SidebarNavComponent, NgxSpinnerComponent ,BannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  loadingText: string = 'Loading...';

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.spinnerService.loadingText$.subscribe(text => {
      this.loadingText = text; // Update the loading text dynamically
    });
  }

}
