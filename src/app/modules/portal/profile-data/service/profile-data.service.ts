import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { OptionItem } from '../../../../core/interfaces/option.interface';
import { FunctionalRoleResponse } from '../../../../core/interfaces/functional-role.interface';
import { EnglishLevelResponse } from '../../../../core/interfaces/english-level.interface';
import { CountryItemResponse } from '../../../../core/interfaces/country.interface';
import { SkillItemDTO } from '../../../../core/interfaces/skill.interface';


@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {


  private http = inject(HttpClient);

  private readonly _firstName$ = new BehaviorSubject<string>('');
  readonly firstName$ = this._firstName$.asObservable();

  getPersonData() {
    return this.http.get<any>(`${environment.apiBaseUrl}/portal/person/profile`).pipe(
      tap(p => this._firstName$.next(p.firstName ?? ''))
    );
  }
  getFunctionalRoles(): Observable<OptionItem[]> {
    return this.http.get<FunctionalRoleResponse[]>(`${environment.apiBaseUrl}/role-functional/all`).pipe(
      map(roles => roles.map(role => ({
        label: role.name,
        value: role.id
      })))
    );
  }

  getSkills(): Observable<OptionItem[]> {
    return this.http.get<SkillItemDTO[]>(`${environment.apiBaseUrl}/skills/all`).pipe(
      map(skills => skills.map(skill => ({
        label: skill.name,
        value: skill.id
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

  updatePersonProfile(payload: any) {
    return this.http.put<any>(`${environment.apiBaseUrl}/portal/person/profile`, payload).pipe(
      tap(p => this._firstName$.next(p.firstName ?? ''))
    );
  }

  uploadCv(personId: number, file: File, fromProfile: boolean) {
    const formData = new FormData();

    formData.append('cv', file);
    formData.append('fromProfile', String(fromProfile));

    return this.http.post(`${environment.apiBaseUrl}/cv/upload/${personId}`,formData);
  }

  getMyCvs(personId: number) {
  return this.http.get<any>(`${environment.apiBaseUrl}/cv/get-myCvs/${personId}`,
  );
}

deleteCv(personId: number, cvId: number) {
  return this.http.delete<boolean>(
    `${environment.apiBaseUrl}/cv/delete`,
    { 
      params: { 
        personId: personId.toString(), 
        cvId: cvId.toString() 
      } 
    }
  );
}

downloadCvUrl(cvId: number): string {
  return `${environment.apiBaseUrl}/cv/download/${cvId}`;
}

}
