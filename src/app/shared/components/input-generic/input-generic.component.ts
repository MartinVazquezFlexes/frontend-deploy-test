import { Component, EventEmitter, Input, Output, forwardRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
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
      multi: true
    }
  ]
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

  ngOnInit() {
    if (this.type === 'tel') {
      this.countryService.loadCountries();
      
      this.countryService.countries$.subscribe(countries => {
        this.countries = countries;
      });

      this.countryService.selectedCountry$.subscribe(country => {
        if (country) {
          this.selectedCountry = country;
          this.countryChange.emit(country);
          if (this.innerValue) {
            this.onInputChange(this.innerValue);
          }
        }
      });
    }
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
    if (this.type === 'tel' && this.selectedCountry) {
      const dialCode = this.selectedCountry.dialCode;
      this.innerValue = value?.replace(dialCode, '') || '';
    } else {
      this.innerValue = value || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(value: string): void {
    if (this.type === 'tel' && this.selectedCountry) {
      const dialCode = this.selectedCountry.dialCode;
      const phoneNumber = value.replace(/\D/g, '');
      this.innerValue = phoneNumber;
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
    this.onChange('');
    this.onTouch();
  }

  get fieldIsTouched(): boolean {
    return this.touched || this.localTouched;
  }
}