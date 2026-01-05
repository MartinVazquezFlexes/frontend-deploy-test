import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CountryCode } from './country-code.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private URL_COUNTRIES =
    'https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd';

  private countriesSubject = new BehaviorSubject<CountryCode[]>([]);
  countries$ = this.countriesSubject.asObservable();

  private selectedCountrySubject = new BehaviorSubject<CountryCode | null>(
    null
  );
  selectedCountry$ = this.selectedCountrySubject.asObservable();

  get countries(): CountryCode[] {
    return this.countriesSubject.value;
  }

  get selectedCountry(): CountryCode | null {
    return this.selectedCountrySubject.value;
  }

  loadCountries() {
    this.http.get<any[]>(this.URL_COUNTRIES).subscribe({
      next: (data) => {
        const countries = data
          .filter((country) => country.idd.root && country.idd.suffixes)
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flags.png,
            dialCode: country.idd.root + (country.idd.suffixes[0] || ''),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        this.countriesSubject.next(countries);

        if (countries.length > 0 && !this.selectedCountry) {
          this.setSelectedCountry(countries[0]);
        }
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      },
    });
  }

  setSelectedCountry(country: CountryCode) {
    this.selectedCountrySubject.next(country);
  }
}
