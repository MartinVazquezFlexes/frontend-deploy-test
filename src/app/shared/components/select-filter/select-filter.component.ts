import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  inject,
  HostListener,
  Input,
  Output,
  EventEmitter,
  input,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { OptionItem } from '../../../core/interfaces/option.interface';
import { TranslateModule } from '@ngx-translate/core';
import { SelectFilterService } from '../../../core/services/select-filter.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-select-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './select-filter.component.html',
  styleUrl: './select-filter.component.scss',
})
export class SelectFilterComponent implements OnInit, OnDestroy {
  @Input() filterOptions?: OptionItem[];
  @Output() chosenOption = new EventEmitter<OptionItem>();
  @Input() defaultTitle: string = 'Chips filtro';
  @Input() width: string = 'fit-content';

  defaultOption: string = 'Chips filtro';
  selectedOption?: string;
  isDropdownOpen: boolean = false;
  hasSelection: boolean = false;
  private destroy$ = new Subject<void>();


  private platformId = inject(PLATFORM_ID);
  private selectFilterService = inject(SelectFilterService);

  ngOnInit(): void {
    this.selectedOption = this.defaultTitle;

    this.selectFilterService.opened$
      .pipe(takeUntil(this.destroy$))
      .subscribe((openedComponent) => {
        // Si no soy yo mismo, cierro
        if (openedComponent !== this) {
          this.isDropdownOpen = false;
        }
      });
  }

  ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-container')) {
        this.isDropdownOpen = false;
      }
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();

    if (!this.isDropdownOpen) {
      this.selectFilterService.notifyOpen(this);
    }

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: OptionItem): void {
    if (!option.disabled) {
      this.selectedOption = option.text;
      this.hasSelection = true;
      this.isDropdownOpen = false;

      this.chosenOption.emit(option);
    }
  }
}
