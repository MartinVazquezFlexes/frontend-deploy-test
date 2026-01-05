import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { decodeJWT } from '../../../shared/utils/utils';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return true; 
  }

  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    localStorage.removeItem('token');
    return true; 
  }

  try {
    const decodedToken = decodeJWT(token);
    
    if (!decodedToken || !decodedToken.roles) {
      return true;
    }

    const hasRecruiterRole = decodedToken.roles.some((role: any) => role.authority === 'ROLE_RECRUITER');
    
    if (hasRecruiterRole) {
      setTimeout(() => {
        router.navigate(['/']);
      }, 50);
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true; 
  }
};
