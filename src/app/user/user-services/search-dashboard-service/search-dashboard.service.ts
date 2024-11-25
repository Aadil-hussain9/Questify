import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchDashboardService {
  private searchDataSubject = new BehaviorSubject<{ type: string; query: string } | null>(null);
  searchData$ = this.searchDataSubject.asObservable();

  updateSearchData(searchData: { type: string; query: string }) {
    this.searchDataSubject.next(searchData);
  }
}
