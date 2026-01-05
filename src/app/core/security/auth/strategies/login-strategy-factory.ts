import { Injectable, inject } from '@angular/core';
import { LoginStrategy } from './login-strategy.interface';
import { EmailLoginStrategy } from './email-login.strategy';
import { GoogleLoginStrategy } from './google-login.strategy';
import { LinkedInLoginStrategy } from './linkedin-login.strategy';

export enum LoginType {
  EMAIL = 'email',
  GOOGLE = 'google',
  LINKEDIN = 'linkedin'
}

@Injectable({
  providedIn: 'root'
})
export class LoginStrategyFactory {
  private emailStrategy = inject(EmailLoginStrategy);
  private googleStrategy = inject(GoogleLoginStrategy);
  private linkedinStrategy = inject(LinkedInLoginStrategy);

  createStrategy(type: LoginType): LoginStrategy {
    switch (type) {
      case LoginType.EMAIL:
        return this.emailStrategy;
      case LoginType.GOOGLE:
        return this.googleStrategy;
      case LoginType.LINKEDIN:
        return this.linkedinStrategy;
      default:
        throw new Error(`Tipo de login no soportado: ${type}`);
    }
  }
} 