import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoginStrategy } from './login-strategy.interface';
import { LoginResponseDTO, EmailLoginRequestDTO } from '../auth.login';

@Injectable({
  providedIn: 'root'
})
export class EmailLoginStrategy implements LoginStrategy {
  private http = inject(HttpClient);

  login(credentials: { email: string; password: string}): Observable<LoginResponseDTO> {
    const body: EmailLoginRequestDTO = {
      email: credentials.email,
      password: credentials.password,
    };
    return this.http.post<LoginResponseDTO>(`${environment.apiBaseUrl}/auth/email-login`, body);
  }
} 