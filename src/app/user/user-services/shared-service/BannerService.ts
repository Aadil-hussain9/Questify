import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, interval, switchMap, tap } from "rxjs";

const BASIC_URL= ['http://localhost:8080/'];
@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private bannerState = new BehaviorSubject<BannerResponse>({
    status: false,
    message: '',
  });
  public bannerState$ = this.bannerState.asObservable();
  private pollingSubscription: any;

  constructor(private http: HttpClient) {
    this.startPolling();
  }

  private getBannerStatus(): Observable<BannerResponse> {
    return this.http.get<BannerResponse>(BASIC_URL+`/api/banner`);
  }

  public startPolling(): void {
    // Poll every 2 minutes (120000 milliseconds)
    this.pollingSubscription = interval(120000)
      .pipe(
        switchMap(() => this.getBannerStatus()),
        tap(response => this.bannerState.next(response))
      )
      .subscribe();
  }

  public stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  public updateBannerState(status: boolean, message: string): void {
    this.bannerState.next({ status, message });
  }
}

export interface BannerResponse {
  status: boolean;
  message: string;
}
