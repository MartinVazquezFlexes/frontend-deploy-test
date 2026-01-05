import { Routes } from '@angular/router';
import { authGuard } from './core/security/guards/auth-guard';
import { loginGuard } from './core/security/guards/login-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/security/auth/login/login-container/login-container.component').then(m => m.LoginContainerComponent),
    canActivate: [loginGuard],
    data: { title: 'Iniciar Sesión' }
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/portal/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
    data: { breadcrumb: 'NAVBAR.BREADCRUMB_ROUTES.HOME' }

  },
  {
    path:'profile-data',
    loadComponent: () =>
      import('./modules/portal/profile-data/profile-data.component').then(m => m.ProfileDataComponent),
    canActivate: [authGuard],
    data: { breadcrumb: 'NAVBAR.BREADCRUMB_ROUTES.MY_PROFILE' }
  },
  {
    path:'job-detail',
    loadComponent: () =>
      import('./shared/components/job-detail/job-detail.component').then(m => m.JobDetailComponent),
    canActivate: [authGuard],
    data: { breadcrumb: 'NAVBAR.BREADCRUMB_ROUTES.JOB_DETAILS' }
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/error-pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/components/error-pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/components/error-pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];
