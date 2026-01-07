import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoginStrategy } from './login-strategy.interface';
import { LoginResponseDTO, GoogleLoginRequestDTO } from '../auth.login';
import { FirebaseService } from '../services/firebase.service';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class GoogleLoginStrategy implements LoginStrategy {
  private http = inject(HttpClient);
  private firebaseService = inject(FirebaseService);

  async openAuthPopup(): Promise<LoginResponseDTO> {
    try {
      const userCredential = await this.firebaseService.signInWithGoogle();

      const credential =
        GoogleAuthProvider.credentialFromResult(userCredential);
      const accessToken = credential?.accessToken;

      if (!accessToken) {
        throw new Error('No se pudo obtener el access token de Google');
      }

      return new Promise<LoginResponseDTO>((resolve, reject) => {
        this.sendTokenToBackend(accessToken).subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(
              new Error(
                `Error del backend: ${error.message || 'Error desconocido'}`
              )
            );
          },
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error durante la autenticación con Google: ${error.message}`
        );
      } else {
        throw new Error(
          'Error desconocido durante la autenticación con Google'
        );
      }
    }
  }

  private sendTokenToBackend(token: string): Observable<LoginResponseDTO> {
    const body: GoogleLoginRequestDTO = { accessToken: token, role: 'APPLICANT' };
    return this.http.post<LoginResponseDTO>(
      `${environment.apiBaseUrl}/auth/google-login`,
      body
    );
  }

  login(credentials: any): Observable<LoginResponseDTO> {
    throw new Error(
      'Google login debe usar openAuthPopup() en lugar de login()'
    );
  }
}
