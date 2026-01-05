import { Component, inject, output } from '@angular/core';
import { InputGenericComponent } from '../shared/components/input-generic/input-generic.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmpleoService } from '../core/services/empleo.service';
import { SelectFilterComponent } from '../shared/components/select-filter/select-filter.component';
import { OptionItem } from '../core/interfaces/option.interface';
import { FILTER_OPTIONS } from '../shared/utils/options';
import { TranslateModule } from '@ngx-translate/core';

const FILTERS = [
  'FILTERS.SELECT.ORDER_BY',
  'FILTERS.SELECT.LOCATION',
  'FILTERS.SELECT.WORK_TYPE',
  'FILTERS.SELECT.EXPERIENCE',
  'FILTERS.SELECT.SALARY',
  'FILTERS.SELECT.WORK_MODE',
];



@Component({
  selector: 'app-input-filter',
  imports: [
    InputGenericComponent,
    ButtonComponent,
    ReactiveFormsModule,
    SelectFilterComponent,
    TranslateModule
  ],
  templateUrl: './input-filter.component.html',
  styleUrl: './input-filter.component.scss',
})
export class InputFilterComponent {
  searchResults = output<{cargo: string, ubicacion: string, filtros: Record<string, OptionItem>}>();

  filters = FILTERS;
  filterOptions = FILTER_OPTIONS;
  filter: string = 'FILTERS.SELECT.ORDER_BY';
  label: string = 'Buscar por cargo empresa...';
  showFilters = false;
  resultados: any[] = [];
  empleoService = inject(EmpleoService);

  cargoEmpresaControl = new FormControl('');
  ubicacionControl = new FormControl('');

  selectedFilters: Record<string, OptionItem> = {};
  resultNotFound: boolean=false;

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }

  showFilter() {
    this.showFilters = !this.showFilters;
  }

  onFilterSelected(filterName: string, selectedOption: OptionItem): void {
  this.selectedFilters[filterName] = selectedOption;
  console.log('Filtros actuales:', this.selectedFilters);
}

searchFilter() {
  const cargo = this.cargoEmpresaControl.value?.toString() ?? '';
  const ubicacion = this.ubicacionControl.value?.toString() ?? '';

  this.resultados = this.empleoService.buscarEmpleos(cargo, ubicacion, this.selectedFilters);
  this.resultNotFound = this.resultados.length === 0;
  console.log(this.resultados);

  this.searchResults.emit({
    cargo: cargo,
    ubicacion: ubicacion,
    filtros: this.selectedFilters
  });
}
}
