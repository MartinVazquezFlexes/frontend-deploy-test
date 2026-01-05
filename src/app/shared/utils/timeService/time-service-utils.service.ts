import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeServiceUtilsService {

  constructor(private translate: TranslateService) {}

  getRelativeTime(creationDate: string): Observable<string> {
    const createdAt = new Date(creationDate);
    const now = new Date();
  
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
  
    let key = '';
    let count = 0;
  
    if (diffHours < 1) {
      return this.translate.get('RELATIVE_TIME.LESS_THAN_HOUR');
    }
  
    if (diffHours < 24) {
      key = diffHours === 1 ? 'RELATIVE_TIME.HOURS' : 'RELATIVE_TIME.HOURS_PLURAL';
      count = diffHours;
    } else if (diffDays < 7) {
      key = diffDays === 1 ? 'RELATIVE_TIME.DAYS' : 'RELATIVE_TIME.DAYS_PLURAL';
      count = diffDays;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      key = weeks === 1 ? 'RELATIVE_TIME.WEEKS' : 'RELATIVE_TIME.WEEKS_PLURAL';
      count = weeks;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      key = months === 1 ? 'RELATIVE_TIME.MONTHS' : 'RELATIVE_TIME.MONTHS_PLURAL';
      count = months;
    } else {
      const years = Math.floor(diffDays / 365);
      key = years === 1 ? 'RELATIVE_TIME.YEARS' : 'RELATIVE_TIME.YEARS_PLURAL';
      count = years;
    }
  
    return this.translate.get(key, { count });
  }

}
