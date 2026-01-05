import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoginStrategy } from './login-strategy.interface';
import { LoginResponseDTO } from '../auth.login';
import {
  decodeBase64,
  extractHashFromUrl,
} from '../../../../shared/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class LinkedInLoginStrategy implements LoginStrategy {
  private http = inject(HttpClient);

  login(): Observable<LoginResponseDTO> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');

    return this.http
      .post(
        `${environment.apiBaseUrl}/auth/linkedin/authorize`,
        {},
        {
          headers,
          responseType: 'text',
        }
      )
      .pipe(
        switchMap((response) => {
          // Verificar si estamos en el navegador antes de redirigir
          if (typeof window !== 'undefined') {
            window.location.href = response;
          }
          return of({} as LoginResponseDTO);
        })
      );
  }

  processLinkedInCallback(): void {
    const hash = extractHashFromUrl();
    const decodedData = decodeBase64(hash!);

    localStorage.setItem('token', decodedData.jwt);
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: decodedData.userId,
        email: decodedData.email,
      })
    );
  }
}
