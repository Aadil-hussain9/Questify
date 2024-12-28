import {inject, Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize, delay, tap } from 'rxjs/operators';
import { BannerService } from '../user-services/shared-service/BannerService';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  const bannerService = inject(BannerService);
  spinner.show();

  return next(req).pipe(
    tap(event => {
      debugger
      if (event instanceof HttpResponse) {
        const bannerStatus:any = event.headers.get('x-banner-status');
        const bannerMessage:any = event.headers.get('X-Banner-Message');
        if (bannerStatus === 'true' && bannerMessage) {
          bannerService.updateBannerState(true, bannerMessage);
        }else {
          bannerService.updateBannerState(false, '');
        }
      }
    }),
    delay(2000),
    finalize(() => spinner.hide())
  );
};
