import { Component, OnInit } from '@angular/core';
import { ForYouSectionComponent } from '../for-you-section/for-you-section.component';
import { VacancyCard } from '../../../core/interfaces/VacancyCard.interface';
import { RecentSearchesComponent } from '../../../shared/components/recent-searches/recent-searches.component';
import { WorkSavedComponent } from '../work-saved/work-saved.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmpleoService } from '../../../core/services/empleo.service';
import { OptionItem } from '../../../core/interfaces/option.interface';

@Component({
  selector: 'app-home',
  imports: [
    ForYouSectionComponent,
    RecentSearchesComponent,
    WorkSavedComponent,
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  jobs: VacancyCard[] = [];
  empleoService = new EmpleoService();

  ngOnInit() {
    this.cargarEmpleos();
  }

  cargarEmpleos(
    cargo: string = '',
    ubicacion: string = '',
    filtros: Record<string, OptionItem> = {}
  ) {
    const empleosFiltrados = this.empleoService.buscarEmpleos(cargo, ubicacion, filtros);

    this.jobs = empleosFiltrados.map((empleo) => ({
      id: empleo.id,
      rol: empleo.cargo,
      logoCompany: '/assets/img/logo-microsoft.png',
      location: `${empleo.ubicacion.ciudad}, ${empleo.ubicacion.provincia}, ${empleo.ubicacion.pais}`,
      creationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      nameCompany: empleo.empresa,
    }));
  }

  onSearchResults(
    cargo: string,
    ubicacion: string,
    filtros: Record<string, OptionItem>
  ) {
    this.cargarEmpleos(cargo, ubicacion, filtros);
  }
}
