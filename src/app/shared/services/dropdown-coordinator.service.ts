import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DropdownCoordinatorService {
  private openedSubject = new Subject<string>();
  opened$ = this.openedSubject.asObservable();

  notifyOpened(componentId: string): void {
    this.openedSubject.next(componentId);
  }
}


