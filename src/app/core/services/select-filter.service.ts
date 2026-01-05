import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectFilterComponent } from '../../shared/components/select-filter/select-filter.component';

@Injectable({
  providedIn: 'root'
})
export class SelectFilterService {

  private openedSubject = new Subject<SelectFilterComponent>();

  opened$ = this.openedSubject.asObservable();

  notifyOpen(component: SelectFilterComponent) {
    this.openedSubject.next(component);
  }
}
