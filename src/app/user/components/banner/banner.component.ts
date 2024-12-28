import { Component } from '@angular/core';
import { BannerService } from '../../user-services/shared-service/BannerService';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  animations: [
    trigger('bannerAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class BannerComponent {
  showBanner = false;
  bannerMessage = '';
  bannerType: 'info' | 'success' | 'warning' | 'error' = 'info';
  private subscription = new Subscription();

  get bannerTypeClass(): string {
    const baseClasses = 'shadow-lg';
    const typeClasses = {
      info: 'bg-blue-600 text-white',
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-500 text-gray-900',
      error: 'bg-red-600 text-white'
    };
    return `${baseClasses} ${typeClasses[this.bannerType]}`;
  }

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.subscription = this.bannerService.bannerState$.subscribe(
      ({ status, message}) => {
        this.showBanner = status;
        this.bannerMessage = message;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeBanner(): void {
    this.bannerService.updateBannerState(false, '');
  }

  isLightBackground(): boolean {
    return this.bannerType !== 'warning';
  }
}
