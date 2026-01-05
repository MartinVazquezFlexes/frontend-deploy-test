import { Component, computed, inject, signal } from '@angular/core';
import { HeaderLogoComponent } from './header-logo/header-logo.component';
import { HeaderLinksComponent } from './header-links/header-links.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { OptionItem } from '../../../core/interfaces/option.interface';
import { VacancyCard } from '../../../core/interfaces/VacancyCard.interface';
import { EmpleoService } from '../../../core/services/empleo.service';
import { InputFilterComponent } from '../../../input-filter/input-filter.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [HeaderLogoComponent, HeaderLinksComponent, BreadcrumbComponent, InputFilterComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  jobs: VacancyCard[] = [];
  empleoService = new EmpleoService();


  private router = inject(Router);
  private currentUrl = signal<string>('');

  // Rutas donde se debe mostrar el buscador
  private visibleRoutes = ['/', '/home'];

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  showSearch = computed(() => {
  const url = this.currentUrl();
  return url === '/' || url === '/home';
});



  cargarEmpleos(
    cargo: string = '',
    ubicacion: string = '',
    filtros: Record<string, OptionItem> = {}
  ) {
    const empleosFiltrados = this.empleoService.buscarEmpleos(
      cargo,
      ubicacion,
      filtros
    );

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
