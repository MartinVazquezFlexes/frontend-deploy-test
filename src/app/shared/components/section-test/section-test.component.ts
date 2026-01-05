import { Component } from '@angular/core';
import { PagerComponent } from '../pager/pager.component';

@Component({
  selector: 'app-section-test',
  imports: [PagerComponent],
  templateUrl: './section-test.component.html',
  styleUrl: './section-test.component.scss'
})
export class SectionTestComponent {
  currentPage= 0;
  onPageChanged(page: number): void {
    this.currentPage = page;
  }
  get getCurrentPage(): number {
    return this.currentPage;
  }
}