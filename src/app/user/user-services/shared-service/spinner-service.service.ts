import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loadingText = new BehaviorSubject<string>('Loading...'); // Default text
  loadingText$ = this.loadingText.asObservable();

  constructor(private spinner: NgxSpinnerService) {}

  showSpinner(text: string): void {
    this.loadingText.next(text); // Update the text
    this.spinner.show(); // Show the spinner
  }

  hideSpinner(): void {
    this.spinner.hide(); // Hide the spinner
  }
}
