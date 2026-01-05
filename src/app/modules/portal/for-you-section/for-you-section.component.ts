import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { VacancyCard } from '../../../core/interfaces/VacancyCard.interface';
import { PagerComponent } from "../../../shared/components/pager/pager.component";
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
  selector: 'app-for-you-section',
  imports: [PagerComponent, CardComponent],
  templateUrl: './for-you-section.component.html',
  styleUrl: './for-you-section.component.scss'
})
export class ForYouSectionComponent implements OnChanges{
  sectionTitle = input.required<string>();
  sizeTitle= input<"small"|"large">("small");
  jobs= input.required<VacancyCard[]>();
  visibleJobs:VacancyCard[]=[];
  pageSize = 5;
  currentPage = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobs']) {
      this.updateVisibleJobs();
    }
  }
  onPageChanged(page: number):void{
    this.currentPage = page;
    this.updateVisibleJobs();
  }

  private updateVisibleJobs(): void {
    const startIndex = (this.currentPage ) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.visibleJobs = this.jobs().slice(startIndex, endIndex);
  }
}
