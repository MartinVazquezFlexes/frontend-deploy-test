import { Component, input, model, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pager',
  imports: [TranslateModule],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent {
  totalItems= input.required<number>();
  itemsPerPage= input<number>(10);
  actualPage= model<number>(0);
  pageChanged= output<number>();
  minArrowVisivility=20;
  maxPagesVisibles=5;

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.actualPage();
  
    if (total <= this.maxPagesVisibles) {
      return Array.from({ length: total }, (_, i) => i);
    }
  
    const visible: number[] = [];
    const windowSize = 3;
  
    let start = current - Math.floor(windowSize / 2);
    let end = current + Math.floor(windowSize / 2);
  
    // Ajustar los bordes si se sale del rango
    if (start < 0) {
      start = 0;
      end = windowSize - 1;
    }
  
    if (end >= total) {
      end = total - 1;
      start = total - windowSize;
    }
  
    for (let i = start; i <= end; i++) {
      visible.push(i);
    }
  
    return visible;
  }
  
  get shouldShowEllipsis(): boolean {
    return this.totalPages > this.maxPagesVisibles && this.visiblePages.at(-1)! < this.totalPages - 1;
  }

  get getTotalItems():number {
    return  this.totalItems();
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems()/ this.itemsPerPage());
  }

  firstChangePage():void{
    this.changePage(0);
  }
  lastChangePage():void{
    this.changePage(this.totalPages-1); 
  }
  changePage(page:number): void {
    if (page >= 0 && page < this.totalPages) {
      this.actualPage.set(page);
      this.pageChanged.emit(page); 
    }
  }
}
