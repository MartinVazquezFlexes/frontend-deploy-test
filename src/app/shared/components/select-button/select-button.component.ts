import {
  Component,
  OnInit,
  HostListener,
  Output,
  Input,
  EventEmitter,
  PLATFORM_ID,
  inject,
  ChangeDetectorRef,
  OnDestroy,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OptionItem } from '../../../core/interfaces/option.interface';
import { DropdownCoordinatorService } from '../../services/dropdown-coordinator.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-select-button',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './select-button.component.html',
  styleUrl: './select-button.component.scss'
})
export class SelectButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filterOptions?: OptionItem[];
  @Input() dropdownWidth: string = '195px';
  @Input() dropdownMaxHeight: string = '188px';
  @Input() buttonWidth: string = '94px';
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'SELECT_BUTTON.DEFAULT_PLACEHOLDER';
  @Input() multiple: boolean = true; // Por defecto múltiple, pero se puede cambiar a único
  @Input() containerZIndex: number = 9999;
  @Input() dropdownZIndex: number = 10000;
  @Input() searchable: boolean = false;
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() selectedOptionChange = new EventEmitter<OptionItem | null>();

  selectedOption?: string;
  isDropdownOpen: boolean = false;
  searchTerm: string = '';
  private subscriptions = new Subscription();
  private static nextId = 0;
  private componentId = `select-${SelectButtonComponent.nextId++}`;

  get isAnyOptionSelected(): boolean | undefined {
    return this.filterOptions?.some(opt => opt.selected);
  }

  get filteredOptions(): OptionItem[] {
    const options = this.filterOptions || [];
    const term = (this.searchTerm || '').toLowerCase();
    if (!term) {
      return options;
    }
    return options.filter(opt => (opt.label || '').toLowerCase().includes(term));
  }

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private hostEl = inject(ElementRef<HTMLElement>);
  private dropdownCoordinator = inject(DropdownCoordinatorService);

  ngOnInit(): void {
    this.updateSelectedText();
    this.subscriptions.add(
      this.dropdownCoordinator.opened$.subscribe((openedId) => {
        if (openedId !== this.componentId && this.isDropdownOpen) {
          this.isDropdownOpen = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['filterOptions']) {
    this.updateSelectedText();
    this.cdr.detectChanges();
  }
}

  toggleDropdown(event: Event): void {
    if (this.disabled) {
      return;
    }
    
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      // Resetear búsqueda al abrir
      this.searchTerm = '';
      this.dropdownCoordinator.notifyOpened(this.componentId);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleTypeahead(event: KeyboardEvent): void {
    if (!this.isDropdownOpen || !this.searchable) {
      return;
    }
    const target = event.target as HTMLElement;
    const tagName = (target.tagName || '').toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
      return;
    }

    const key = event.key;
    if (key === 'Backspace') {
      this.searchTerm = this.searchTerm.slice(0, -1);
      this.cdr.detectChanges();
      return;
    }
    if (key === 'Escape') {
      this.searchTerm = '';
      this.cdr.detectChanges();
      return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this.searchTerm += key;
      this.cdr.detectChanges();
    }
  }

  toggleOption(option: OptionItem): void {
    if (option.disabled) return;

    if (this.multiple) {
      // Selección múltiple: toggle del estado
      option.selected = !option.selected;
    } else {
      // Selección única: deseleccionar todos y seleccionar solo este
      if (this.filterOptions) {
        // Crear un nuevo array para forzar la detección de cambios
        this.filterOptions = this.filterOptions.map(opt => ({
          ...opt,
          selected: opt.value === option.value
        }));
      }
    }

    this.updateSelectedText();
    
    // Forzar la detección de cambios para actualizar la vista
    this.cdr.detectChanges();

    setTimeout(() => {
      const selectedValues = this.getSelectedValues();
      this.selectionChange.emit(selectedValues);

      // Emitir también la opción seleccionada (para selección única devuelve el único OptionItem)
      const selectedOption = this.filterOptions?.find(opt => opt.selected) || null;
      this.selectedOptionChange.emit(selectedOption ?? null);
    }, 0);
  }

  updateSelectedText(): void | string{
    const selectedOptions = this.filterOptions?.filter(opt => opt.selected);

    if (selectedOptions?.length === 0) {
      this.selectedOption = '';
    } else if (selectedOptions?.length === 1) {
      this.selectedOption = selectedOptions[0].label;
    } else if (this.multiple) {
      // Solo mostrar contador si es selección múltiple
      this.selectedOption = `${selectedOptions?.length} seleccionados`;
    } else {
      // Para selección única, siempre mostrar solo el label
      this.selectedOption = selectedOptions?.[0]?.label || '';
    }
  }

  getSelectedValues(): any[] |undefined {
    const selectedOptions = this.filterOptions?.filter(opt => opt.selected);
    
    const values = selectedOptions?.map(opt => opt.value);
    
    return values;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const target = event.target as HTMLElement;
    const clickedInsideThis = this.hostEl.nativeElement.contains(target);
    if (!clickedInsideThis) {
      this.isDropdownOpen = false;
    }
  }
}
