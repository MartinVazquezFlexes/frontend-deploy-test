import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacancyCard } from '../../../core/interfaces/VacancyCard.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeServiceUtilsService } from '../../utils/timeService/time-service-utils.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card',
  imports: [CommonModule,TranslateModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  // setts
  header=input(false);
  accionsheader=input(false)
  actions=input(false);
  hoverable=input(true);
  selected=input(false);
  vacancy= input.required<VacancyCard>();
  relativeDate?:string;
  routerLink = input<string | undefined>(undefined);
  get image(): boolean {
    return this.vacancy().logoCompany !== undefined&&this.vacancy().logoCompany !=="";
  }
  private router = inject(Router);
  private utilsTime = inject(TimeServiceUtilsService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.setRelativeDate();
  }

  setRelativeDate(): void {
    this.utilsTime.getRelativeTime(this.vacancy().creationDate).subscribe((text: string) => {
      this.relativeDate = text;
    });
  }

  onCardClick(): void {
    this.router.navigate(['/job-detail']);
  }

  
}
