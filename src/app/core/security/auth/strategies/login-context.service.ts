import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginStrategy } from './login-strategy.interface';
import { LoginStrategyFactory, LoginType } from './login-strategy-factory';
import { LoginResponseDTO } from '../auth.login';

@Injectable({
  providedIn: 'root'
})
export class LoginContextService {
  private strategyFactory = inject(LoginStrategyFactory);
  private currentStrategy?: LoginStrategy;

  setStrategy(type: LoginType): void {
    this.currentStrategy = this.strategyFactory.createStrategy(type);
  }

  login(credentials: any): Observable<LoginResponseDTO> {
    if (!this.currentStrategy) {
      throw new Error('No se ha configurado una estrategia de login');
    }
    
    return this.currentStrategy.login(credentials);
  }

  async loginWithOAuth(type: LoginType): Promise<LoginResponseDTO> {
    this.setStrategy(type);
    
    if (!this.currentStrategy?.openAuthPopup) {
      throw new Error(`La estrategia ${type} no soporta login con OAuth`);
    }

    try {
      const response = await this.currentStrategy.openAuthPopup();
      return response;
    } catch (error) {
      throw error;
    }
  }

  getAuthUrl(type: LoginType): string {
    this.setStrategy(type);
    
    if (!this.currentStrategy?.getAuthUrl) {
      throw new Error(`La estrategia ${type} no soporta getAuthUrl`);
    }

    return this.currentStrategy.getAuthUrl();
  }


} 