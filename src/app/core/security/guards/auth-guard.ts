import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { decodeJWT } from '../../../shared/utils/utils';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/unauthorized']);
    return false;
  }

  const userStr = localStorage.getItem('user');

  if (!userStr) {
    localStorage.removeItem('token');

    router.navigate(['/unauthorized']);
    return false;
  }

  try {
    const decodedToken = decodeJWT(token);

    if (!decodedToken || !decodedToken.roles) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.navigate(['/forbidden']);
      return false;
    }

    const hasValidRole = decodedToken.roles.some(
      (role: any) => role.authority === 'ROLE_RECRUITER' || role.authority === 'ROLE_APPLICANT' || role.authority === 'ROLE_DEFAULT'
    );

    if (!hasValidRole) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.navigate(['/forbidden']);
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.navigate(['/unauthorized']);
    return false;
  }
};
