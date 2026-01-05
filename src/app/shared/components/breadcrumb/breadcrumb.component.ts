import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  RouterModule,
  ActivatedRoute,
  Router,
  NavigationEnd,
} from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface BreadcrumbItem {
  label: string;
  url: string;
  isLast: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterModule, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  breadcrumbItems: BreadcrumbItem[] = [];

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.buildBreadcrumb();
      });

      this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.buildBreadcrumb();
      });

    this.buildBreadcrumb();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildBreadcrumb(): void {
    this.breadcrumbItems = [];

    let currentRoute = this.activatedRoute;
    const url: string[] = [];
    const breadcrumbs: BreadcrumbItem[] = [];

    // Recorrer hacia arriba en la jerarquía de rutas
    while (currentRoute.children.length > 0) {
      const childrenRoutes = currentRoute.children;
      let breadcrumbRoute = null;

      // Encontrar la ruta activa entre los hijos
      for (const route of childrenRoutes) {
        if (route.outlet === 'primary') {
          breadcrumbRoute = route;
          break;
        }
      }

            if (breadcrumbRoute) {
        const routeSnapshot = breadcrumbRoute.snapshot;
        const routeUrl = routeSnapshot.url
          .map((segment) => segment.path)
          .join('/');

        // Obtener el breadcrumb del data de la ruta
        const breadcrumb = routeSnapshot.data['breadcrumb'];

        if (breadcrumb) {
          // Si es un parámetro dinámico, usar el valor real
          const paramValue = this.getParamValue(routeSnapshot);
          const label = paramValue || this.translate.instant(breadcrumb);

          // Para la ruta raíz, no agregar URL vacía
          if (routeUrl) {
            url.push(routeUrl);
          }

          // No agregar breadcrumb para la ruta raíz si estamos en la raíz
          if (routeUrl || this.router.url !== '/') {
            breadcrumbs.push({
              label,
              url: url.length > 0 ? '/' + url.join('/') : '/',
              isLast: false,
            });
          }
        }

        currentRoute = breadcrumbRoute;
      } else {
        break;
      }
    }

    // Marcar el último elemento
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    this.breadcrumbItems = breadcrumbs;
  }

  private getParamValue(snapshot: any): string | null {
    // Buscar parámetros dinámicos en la URL
    const urlSegments = snapshot.url;
    const params = snapshot.params;

    for (const segment of urlSegments) {
      if (segment.path.startsWith(':')) {
        const paramName = segment.path.substring(1);
        return params[paramName] || null;
      }
    }

    return null;
  }

  get shouldShowBreadcrumb(): boolean {
    const currentUrl = this.router.url;
    const excludedRoutes = [
      '/login',
      '/unauthorized',
      '/forbidden',
      '/not-found',
    ];
    return !excludedRoutes.some((route) => currentUrl.includes(route));
  }
}
