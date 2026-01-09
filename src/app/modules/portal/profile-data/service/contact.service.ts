import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ResponseContactDTO } from '../../models/MyContactsModels';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly contactUrl = environment.apiBaseUrl + '/contact/list';

  constructor(private http: HttpClient) { }

  getAllContactsByPerson(): Observable<ResponseContactDTO[]> {
    return this.http.get<ResponseContactDTO[]>(this.contactUrl);
  }

  deleteContact(id: number) {
    console.log('Deleting contact with id:', id);
    return this.http.delete<void>(environment.apiBaseUrl + '/contact/' + id);
  }
}
