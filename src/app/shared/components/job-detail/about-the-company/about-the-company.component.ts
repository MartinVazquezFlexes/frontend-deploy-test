import { Component, input } from '@angular/core';
import { ButtonComponent } from "../../button/button.component";
import { JobDetail } from '../../../../core/interfaces/VacancyCard.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-the-company',
  imports: [ButtonComponent,TranslateModule],
  templateUrl: './about-the-company.component.html',
  styleUrl: './about-the-company.component.scss'
})
export class AboutTheCompanyComponent {
  company = input.required<JobDetail>();
  companyData = input<AboutTheCompany>({
    name: "Techforb", 
    description: "Somos una empresa de Recursos Humanos con foco en Tecnología. Acompañamos la gestión de recursos, brindando soluciones de capital humano: Búsqueda y Selección, Head Hunting y Staffing IT. Focalizados en la mejora continua de los procesos favoreciendo el crecimiento, eficiencia y rentabilidad de nuestros clientes.", 
    web: "https://techforb.com/es"
  });
}

interface AboutTheCompany {
  name: string,
  description: string,
  web: string
}
