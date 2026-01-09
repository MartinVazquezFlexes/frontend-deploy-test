import { Component, inject, OnInit, ChangeDetectorRef, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InputGenericComponent } from '../../../../shared/components/input-generic/input-generic.component';
import { SelectButtonComponent } from '../../../../shared/components/select-button/select-button.component';
import { CountryService } from '../../../../shared/services/country/country.service';
import { ProfileDataService } from '../service/profile-data.service';
import { ProfileForm } from './profile-form.interface';
import { TranslateModule } from '@ngx-translate/core';
import { OptionItem } from '../../../../core/interfaces/option.interface';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { debounceTime } from 'rxjs';

export interface MyDataInput {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;

  countryId: string | null;
  functionalRoleId: string | null;
  languageId: string | null;
}

@Component({
  selector: 'app-my-data',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, InputGenericComponent, SelectButtonComponent, TranslateModule],
  templateUrl: './my-data.component.html',
  styleUrl: './my-data.component.scss',
})
export class MyDataComponent implements OnInit, OnChanges {
  fb = inject(NonNullableFormBuilder);
  countryService = inject(CountryService);
  profileDataService = inject(ProfileDataService);
  private cdr = inject(ChangeDetectorRef);

  @Input() data: MyDataInput | null = null;
  @Output() componentReady = new EventEmitter<void>();

  isSaving = false;
  saveError: string | null = null;
  saveOk = false;

  functionalRoleOptions: OptionItem[] = [];
  englishLevelOptions: OptionItem[] = [];
  countryOptions: OptionItem[] = [];

  functionalRoleOptionsReady = false;
  englishLevelOptionsReady = false;
  countryOptionsReady = false;

  @Output() functionalRoleChange = new EventEmitter<OptionItem | null>();
  @Output() englishLevelChange = new EventEmitter<OptionItem | null>();
  @Output() countryChange = new EventEmitter<OptionItem | null>();
  @Output() dataChange = new EventEmitter<any>();

  profileForm = this.fb.group<ProfileForm>({
    avatar: this.fb.control<string>(''),
    firstName: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: this.fb.control<string>('', [Validators.email]),
    phone: this.fb.control<string>('', [
      Validators.required,
      Validators.pattern('^\\+[0-9]{1,4}[0-9]{6,14}$'),
      Validators.minLength(13),
      Validators.maxLength(15),
    ]),
    functionalRole: this.fb.control<string>(''),
    englishLevel: this.fb.control<string>(''),
    country: this.fb.control<string>('')
  });

  ngOnInit() {
    this.loadFunctionalRoles();
    this.loadEnglishLevels();
    this.loadCountries();
    this.patchFormFromInput();
    this.profileForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.emitData());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue) {
      this.patchFormFromInput();
    }
  }

  private patchFormFromInput(): void {
    if (!this.data) return;

    this.profileForm.patchValue(
      {
        firstName: this.data.firstName ?? '',
        lastName: this.data.lastName ?? '',
        email: this.data.email ?? '',
        phone: this.data.phoneNumber ?? '',
        functionalRole: this.data.functionalRoleId != null ? this.data.functionalRoleId : '',
        englishLevel: this.data.languageId != null ? String(this.data.languageId) : '',
        country: this.data.countryId != null ? String(this.data.countryId) : '',
      },
      { emitEvent: false }
    );

    this.profileForm.get('email')?.disable();
    this.loadSelects();
  }
  loadFunctionalRoles() {
    this.profileDataService.getFunctionalRoles().subscribe({
      next: (roles) => {
        const uniqueRolesMap = new Map(roles.map(role => [role.label, role]));

        this.functionalRoleOptions = Array.from(uniqueRolesMap.values());
        this.normalizeFunctionalRoleOptions();
        this.cdr.detectChanges();
        this.functionalRoleOptionsReady = true;
        this.loadSelects();
      },
      error: (error) => {
        this.functionalRoleOptions = [];
      }
    });
  }

  onFunctionalRoleChange(selectedOptions: any[]) {
    if (selectedOptions.length > 0) {
      const selectedRoleValue = selectedOptions[0];

      // Actualizar el formulario con el valor correcto
      this.profileForm.get('functionalRole')?.setValue(selectedRoleValue);

      // Actualizar el estado de selección en las opciones
      this.functionalRoleOptions = this.functionalRoleOptions.map(option => ({
        ...option,
        selected: String(option.value) === String(selectedRoleValue),
      }));

      // Forzar la detección de cambios
      this.cdr.detectChanges();
    }
  }

  // Reemitir la opción seleccionada (objeto) al componente padre
  onFunctionalRoleObjectChange(option: OptionItem | null) {
    this.functionalRoleChange.emit(option);
  }

  loadEnglishLevels() {
    this.profileDataService.getEnglishLevels().subscribe({
      next: (levels) => {
        this.englishLevelOptions = levels;
        this.cdr.detectChanges();
        this.englishLevelOptionsReady = true;
        this.loadSelects();
      },
      error: () => {
        this.englishLevelOptions = [];
      }
    });
  }

  onEnglishLevelChange(selectedOptions: any[]) {
    if (selectedOptions.length > 0) {
      const selectedLevelValue = selectedOptions[0];
      this.profileForm.get('englishLevel')?.setValue(selectedLevelValue);
      this.englishLevelOptions = this.englishLevelOptions.map(option => ({
        ...option,
        selected: String(option.value) === String(selectedLevelValue),
      }));
      this.cdr.detectChanges();
    }
  }

  onEnglishLevelObjectChange(option: OptionItem | null) {
    this.englishLevelChange.emit(option);
  }

  loadCountries() {
    this.profileDataService.getCountries().subscribe({
      next: (countries) => {
        this.countryOptions = countries;
        this.cdr.detectChanges();
        this.countryOptionsReady = true;
        this.loadSelects();
      },
      error: () => {
        this.countryOptions = [];
      }
    });
  }

  onCountryChange(selectedOptions: any[]) {
    if (selectedOptions.length > 0) {
      const selectedCountryValue = selectedOptions[0];
      this.profileForm.get('country')?.setValue(selectedCountryValue);
      this.countryOptions = this.countryOptions.map(o => ({
        ...o,
        selected: String(o.value) === String(selectedCountryValue),
      }));
      this.cdr.detectChanges();
    }
  }

  onCountryObjectChange(option: OptionItem | null) {
    this.countryChange.emit(option);
  }

  onSaveChanges(): void {
    this.saveError = null;
    this.saveOk = false;

    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    const v = this.profileForm.getRawValue();

    const payload: any = {
      firstName: v.firstName,
      lastName: v.lastName,
      phoneNumber: v.phone,
      countryId: v.country ? Number(v.country) : undefined,
      functionalRoleId: v.functionalRole ? Number(v.functionalRole) : undefined,
      languageId: v.englishLevel ? Number(v.englishLevel) : undefined
    };

    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    this.isSaving = true;

    this.profileDataService.updatePersonProfile(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.saveOk = true;
        this.profileForm.markAsPristine();
        console.log('Profile updated:', res);
      },
      error: (err) => {
        this.isSaving = false;
        this.saveError = 'No se pudo guardar los cambios';
        console.error('Error updating profile:', err);
      },
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form submitted:', this.profileForm.value);
      // El formulario siempre estará habilitado
    }
  }

  emitData(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    const v = this.profileForm.getRawValue();

    const payload = {
      firstName: v.firstName,
      lastName: v.lastName,
      phoneNumber: v.phone,
      countryId: v.country ? Number(v.country) : undefined,
      functionalRoleId: v.functionalRole ? Number(v.functionalRole) : undefined,
      languageId: v.englishLevel ? Number(v.englishLevel) : undefined
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    this.dataChange.emit(cleanedPayload);
  }

  isFieldTouched(field: string): boolean {
    return this.profileForm?.get(field)?.touched ?? false;
  }

  private syncSelectsFromForm(): void {
    const functionalRoleValue = this.profileForm.get('functionalRole')?.value ?? '';
    const englishLevelValue = this.profileForm.get('englishLevel')?.value ?? '';
    const countryValue = this.profileForm.get('country')?.value ?? '';

    this.functionalRoleOptions.forEach(o => o.selected = o.value === functionalRoleValue);
    this.englishLevelOptions.forEach(o => o.selected = o.value === englishLevelValue);
    this.countryOptions.forEach(o => o.selected = o.value === countryValue);

    this.cdr.detectChanges();
  }

  private applyInitialSelections(): void {
    const role = this.profileForm.get('functionalRole')?.value ?? '';
    const level = this.profileForm.get('englishLevel')?.value ?? '';
    const country = this.profileForm.get('country')?.value ?? '';

    if (role && this.functionalRoleOptions.length) {
      this.onFunctionalRoleChange([role]);
      this.onFunctionalRoleObjectChange(
        this.functionalRoleOptions.find(o => o.value === role) ?? null
      );
    }

    if (level && this.englishLevelOptions.length) {
      this.onEnglishLevelChange([level]);
      this.onEnglishLevelObjectChange(
        this.englishLevelOptions.find(o => o.value === level) ?? null
      );
    }

    if (country && this.countryOptions.length) {
      this.onCountryChange([country]);
      this.onCountryObjectChange(
        this.countryOptions.find(o => o.value === country) ?? null
      );
    }
  }
  private normalizeFunctionalRoleOptions(): void {
    this.functionalRoleOptions = (this.functionalRoleOptions ?? []).map(o => ({
      ...o,
      value: String(o.value)
    }));
  }

  private loadSelects(): void {
    if (this.functionalRoleOptionsReady && this.englishLevelOptionsReady && this.countryOptionsReady) {
      this.syncSelectsFromForm
      this.applyInitialSelections();
      this.componentReady.emit();
    }
  }
}
