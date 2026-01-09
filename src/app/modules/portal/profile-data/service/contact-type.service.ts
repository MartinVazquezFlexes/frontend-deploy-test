import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseContactTypeDTO } from '../../models/MyContactsModels';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactTypeService {
  private readonly contactTypeUrl = environment.apiBaseUrl + '/contact-type/list';

  constructor(private http: HttpClient) { }

  getAllContactTypes(): Observable<ResponseContactTypeDTO[]> {
    return this.http
      .get<ResponseContactTypeDTO[]>(this.contactTypeUrl)
      .pipe(
        map(types =>
          types.map(t => ({
            ...t,
            name: normalizeContactTypeName(t.name),
          }))
        )
      );
  }
}

function normalizeContactTypeName(raw: string): string {
  return raw
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
