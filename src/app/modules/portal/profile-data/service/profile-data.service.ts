import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { OptionItem } from '../../../../core/interfaces/option.interface';
import { FunctionalRoleResponse } from '../../../../core/interfaces/functional-role.interface';
import { EnglishLevelResponse } from '../../../../core/interfaces/english-level.interface';
import { CountryItemResponse } from '../../../../core/interfaces/country.interface';


@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {


  private http = inject(HttpClient);
  
  getFunctionalRoles(): Observable<OptionItem[]> {
    return this.http.get<FunctionalRoleResponse[]>(`${environment.apiBaseUrl}/role-functional/all`).pipe(
      map(roles => roles.map(role => ({
        label: role.name,
        value: role.id
      })))
    );
  }

  getFunctionalRolesWithSelection(selectedRoleId: string): Observable<OptionItem[]> {
    return this.getFunctionalRoles().pipe(
      map(roles => roles.map(role => ({
        ...role,
        selected: role.value === selectedRoleId
      })))
    );
  }

  getEnglishLevels(): Observable<OptionItem[]> {
    return this.http
      .get<EnglishLevelResponse[]>(`${environment.apiBaseUrl}/languages/all-english-levels`)
      .pipe(
        map((levels) =>
          levels.map((level) => ({
            label: String(level.languageLevel || level.name || ''),
            value: String(level.id),
          }))
        )
      );
  }

  getEnglishLevelsWithSelection(selectedLevelId: string): Observable<OptionItem[]> {
    return this.getEnglishLevels().pipe(
      map(levels => levels.map(level => ({
        ...level,
        selected: level.value === selectedLevelId
      })))
    );
  }

getCountries(): Observable<OptionItem[]> {
  return this.http
    .get<CountryItemResponse[]>(`${environment.apiBaseUrl}/portal/direction/countries`)
    .pipe(
      map((countries) => {
        //map para eliminar duplicados por nombre
        const uniqueCountries = new Map<string, CountryItemResponse>();
        
        countries.forEach(country => {
          if (!uniqueCountries.has(country.name)) {
            uniqueCountries.set(country.name, country);
          }
        });
        
        //paso a array y lo mapeo
        return Array.from(uniqueCountries.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((country) => ({
            label: country.name,
            value: String(country.id),
          }));
      })
    );
}
}
