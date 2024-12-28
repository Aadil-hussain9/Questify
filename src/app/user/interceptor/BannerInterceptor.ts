import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BannerService } from '../user-services/shared-service/BannerService';

@Injectable()
export class BannerInterceptor implements HttpInterceptor {
  constructor(private bannerService: BannerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        debugger
        if (event instanceof HttpResponse) {
          const bannerStatus:any = event.headers.get('X-Banner-Status');
          const bannerMessage:any = event.headers.get('X-Banner-Message');
          if (bannerStatus === 'true' && bannerMessage) {
            this.bannerService.updateBannerState(true, bannerMessage);
          }
        }
      })
    );
  }
}
