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

  isSaving = false;
  saveError: string | null = null;
  saveOk = false;

  functionalRoleOptions: OptionItem[] = [];
  englishLevelOptions: OptionItem[] = [];
  countryOptions: OptionItem[] = [];

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
        functionalRole: this.data.functionalRoleId ?? '',
        englishLevel: this.data.languageId ?? '',
        country: this.data.countryId ?? '',
      },
      { emitEvent: false }
    );

    this.profileForm.get('email')?.disable();
  }
  loadFunctionalRoles() {
    this.profileDataService.getFunctionalRoles().subscribe({
      next: (roles) => {
        //map para eliminar duplicados
        const uniqueRolesMap = new Map(roles.map(role => [role.label, role]));
        
        //de map a array
        this.functionalRoleOptions = Array.from(uniqueRolesMap.values());
        this.cdr.detectChanges();
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
      this.functionalRoleOptions.forEach(option => {
        option.selected = option.value === selectedRoleValue;
      });
      
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
      this.englishLevelOptions.forEach(option => {
        option.selected = option.value === selectedLevelValue;
      });
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
      this.countryOptions.forEach(option => {
        option.selected = option.value === selectedCountryValue;
      });
      this.cdr.detectChanges();
    }
  }

  onCountryObjectChange(option: OptionItem | null) {
    this.countryChange.emit(option);
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


  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form submitted:', this.profileForm.value);
      // El formulario siempre estará habilitado
    }
  }

  isFieldTouched(field: string): boolean {
    return this.profileForm?.get(field)?.touched ?? false;
  }
}
