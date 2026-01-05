import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { VacancyCard } from '../../../core/interfaces/VacancyCard.interface';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-work-saved',
  imports: [CardComponent, ButtonComponent,TranslateModule],
  templateUrl: './work-saved.component.html',
  styleUrl: './work-saved.component.scss'
})
export class WorkSavedComponent {
  vacancy: VacancyCard = {
    id: 1,
    rol: 'Full Stack Developer Jr.',
    nameCompany: 'Microsoft',
    location: 'Buenos Aires, Provincia de Buenos Aires, Argentina (Presencial)',
    logoCompany: '/assets/img/facebook-logo.svg',
    creationDate: '2024-06-15'
  };

}
