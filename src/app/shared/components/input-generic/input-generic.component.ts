import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CountryCode } from '../../services/country/country-code.interface';
import { CountryService } from '../../services/country/country.service';

@Component({
  selector: 'app-input-generic',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './input-generic.component.html',
  styleUrl: './input-generic.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputGenericComponent),
      multi: true,
    },
  ],
})
export class InputGenericComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() leftImageUrl?: string;
  @Input() rightImageUrl?: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() errors?: ValidationErrors | null;
  @Input() showClearButton: boolean = false;
  @Input() placeholderPosition: 'center' | 'start' = 'center';
  @Input() touched: boolean = false;
  @Input() width: string = '310px';
  @Input() height: string = '54px';
  @Input() floatingLabels: boolean = false;
  @Input() backgroundColor?: string;

  // Tel-specific
  @Input() countries: CountryCode[] = [];
  @Input() selectedCountry: CountryCode | null = null;

  @Output() rightIconClick = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();
  @Output() countryChange = new EventEmitter<CountryCode>();

  private translate = inject(TranslateService);
  private countryService = inject(CountryService);

  innerValue: string = '';
  isDisabled: boolean = false;
  localTouched: boolean = false;
  isFocused: boolean = false;

  // Holds the full phone number coming from the FormControl (e.g. +549223...)
  private pendingFullPhone: string | null = null;

  ngOnInit() {
    if (this.type !== 'tel') return;

    this.countryService.loadCountries();

    this.countryService.countries$.subscribe((countries) => {
      this.countries = countries;

      // If form wrote the phone before countries were loaded, resolve now
      if (this.pendingFullPhone && this.countries?.length) {
        this.applyPhoneAndSelectCountry(this.pendingFullPhone);
      }
    });

    this.countryService.selectedCountry$.subscribe((country) => {
      if (!country) return;

      this.selectedCountry = country;
      this.countryChange.emit(country);

      // If we already have a full phone, ensure innerValue matches this country
      if (this.pendingFullPhone) {
        const normalized = this.normalizePhone(this.pendingFullPhone);
        if (normalized.startsWith(country.dialCode)) {
          this.innerValue = normalized
            .slice(country.dialCode.length)
            .replace(/\D/g, '');
        }
      }

      // If user already typed something, recompute the full value for the FormControl
      if (this.innerValue) {
        this.onInputChange(this.innerValue);
      }
    });
  }

  onSelectCountry(countryCodeValue: string) {
    const foundCountry = this.countries.find((c) => c.code === countryCodeValue);
    if (foundCountry) {
      this.countryService.setSelectedCountry(foundCountry);
    }
  }

  onRightIconClick(): boolean {
    this.rightIconClick.emit();
    return true;
  }

  onChange = (_: any) => {};
  onTouch = () => {
    this.localTouched = true;
    this.inputBlur.emit();
  };

  writeValue(value: any): void {
    if (this.type !== 'tel') {
      this.innerValue = value || '';
      return;
    }

    const full = (value ?? '').toString().trim();
    this.pendingFullPhone = full || null;

    if (!this.pendingFullPhone) {
      this.innerValue = '';
      return;
    }

    // If countries already loaded, resolve immediately
    if (this.countries?.length) {
      this.applyPhoneAndSelectCountry(this.pendingFullPhone);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Keep your original behavior: emit blur + local touched
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(value: string): void {
    if (this.type === 'tel' && this.selectedCountry) {
      const dialCode = this.selectedCountry.dialCode;
      const phoneNumber = (value ?? '').replace(/\D/g, ''); // only digits
      this.innerValue = phoneNumber;

      // FormControl receives full phone: +<dial><digits>
      this.onChange(dialCode + phoneNumber);
    } else {
      this.innerValue = value;
      this.onChange(value);
    }
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouch();
  }

  clearInput(): void {
    this.innerValue = '';
    this.pendingFullPhone = null;
    this.onChange('');
    this.onTouch();
  }

  get fieldIsTouched(): boolean {
    return this.touched || this.localTouched;
  }

  // -----------------------
  // Phone helpers
  // -----------------------
  private normalizePhone(fullPhone: string): string {
    const clean = (fullPhone ?? '').toString().trim();
    if (!clean) return '';
    return clean.startsWith('+') ? clean : `+${clean}`;
  }

  private applyPhoneAndSelectCountry(fullPhone: string): void {
    const normalized = this.normalizePhone(fullPhone);
    if (!normalized) {
      this.innerValue = '';
      return;
    }

    // Choose the longest matching dialCode (avoids conflicts like +1 vs +1242)
    const match = (this.countries ?? [])
      .filter((c) => normalized.startsWith(c.dialCode))
      .sort((a, b) => b.dialCode.length - a.dialCode.length)[0];

    if (match) {
      // Update selected country through the service
      this.countryService.setSelectedCountry(match);

      // Keep only the body (digits) in the visible input
      const body = normalized.slice(match.dialCode.length);
      this.innerValue = body.replace(/\D/g, '');
      return;
    }

    // Fallback: no match => show all digits without '+'
    this.innerValue = normalized.replace(/^\+/, '').replace(/\D/g, '');
  }
}
