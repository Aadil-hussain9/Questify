import { bootstrapApplication} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import {spinnerInterceptor} from './app/user/interceptor/spinner.interceptor';
import { BannerInterceptor } from './app/user/interceptor/BannerInterceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideHttpClient(withInterceptors([spinnerInterceptor])), // Use the functional interceptor
    provideHttpClient(withInterceptorsFromDi()), // Load interceptors from DI
    BannerInterceptor,
    NgxSpinnerService
  ]
});
