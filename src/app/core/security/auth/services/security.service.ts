import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { EmailChangePasswordRequestDTO, LoginResponseDTO } from '../auth.login';
import { Observable, BehaviorSubject } from 'rxjs';
import { decodeJWT } from '../../../../shared/utils/utils';
import { StorageService } from '../../../../shared/utils/storage.service';
import { LoginContextService } from '../strategies/login-context.service';
import { LoginType } from '../strategies/login-strategy-factory';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private loginContext = inject(LoginContextService);
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  setToken(token: string): void {
    this.storageService.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return this.storageService.getItem('token');
  }

  setUser(user: any): void {
    this.storageService.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const userStr = this.storageService.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decodedToken = decodeJWT(token);
      const currentTime = Date.now() / 1000;
      return decodedToken && decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  logout(): void {
    this.storageService.removeItem('token');
    this.storageService.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  handleSuccessfulLogin(response: LoginResponseDTO): void {
    if (response?.jwt?.token) {
      this.setToken(response.jwt.token);
      this.setUser(response.user);
      console.log('Login successful:', response.user);
    }
  }

  // Métodos para login usando el patrón Strategy
  loginWithEmail(email: string, password: string, role: string): Observable<LoginResponseDTO> {
    this.loginContext.setStrategy(LoginType.EMAIL);
    return this.loginContext.login({ email, password, role });
  }

  async loginWithGoogle(): Promise<LoginResponseDTO> {
    const response = await this.loginContext.loginWithOAuth(LoginType.GOOGLE);
    this.handleSuccessfulLogin(response);
    return response;
  }

  loginWithLinkedIn(): void {
    this.loginContext.setStrategy(LoginType.LINKEDIN);
    this.loginContext.login({}).subscribe({
      next: () => {
        console.log('Redirección a LinkedIn iniciada');
      },
      error: (error) => {
        console.error('Error al iniciar login con LinkedIn:', error);
      }
    });
  }

  recoverPassword(changePasswordData: EmailChangePasswordRequestDTO): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/change-password`, changePasswordData);
  }
}
