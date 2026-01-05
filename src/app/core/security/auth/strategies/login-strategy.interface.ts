import { Observable } from 'rxjs';
import { LoginResponseDTO } from '../auth.login';

export interface LoginStrategy {
  login(credentials: any): Observable<LoginResponseDTO>;
  getAuthUrl?(): string;
  openAuthPopup?(): Promise<LoginResponseDTO>;
} 