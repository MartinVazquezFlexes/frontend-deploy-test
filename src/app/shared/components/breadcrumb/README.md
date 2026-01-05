# Componente Breadcrumb

Este componente genera automáticamente breadcrumbs basados en el sistema de rutas de Angular Router.

## Características

- ✅ Construcción dinámica basada en `ActivatedRoute` y sus ancestros
- ✅ Soporte para parámetros dinámicos (ej: `:empresaId`)
- ✅ Navegación funcional con `routerLink`
- ✅ Exclusión automática en rutas de login y error
- ✅ Estilos CSS puros (sin frameworks)
- ✅ Totalmente reutilizable

## Uso

### 1. Integración en AppComponent

El componente ya está integrado en `AppComponent` y se muestra automáticamente en todas las rutas excepto:
- `/login`
- `/unauthorized`
- `/forbidden`
- `/not-found`

### 2. Configuración de Rutas

Para que el breadcrumb funcione correctamente, debes agregar `data.breadcrumb` a tus rutas:

```typescript
export const routes: Routes = [
  {
    path: 'postulaciones',
    data: { breadcrumb: 'Postulaciones' },
    children: [
      {
        path: ':empresaId',
        data: { breadcrumb: 'Empresa' }, // Se reemplazará con el valor real
        children: [
          {
            path: 'aplicar',
            component: ApplicationFormComponent,
            data: { breadcrumb: 'Aplicar' }
          }
        ]
      }
    ]
  }
];
```

### 3. Ejemplo de Resultado

Para la ruta `/postulaciones/techforb/aplicar`, el breadcrumb mostrará:
**Inicio > Postulaciones > Techforb > Aplicar**

## Estructura del Componente

### Archivos
- `breadcrumb.component.ts` - Lógica principal
- `breadcrumb.component.html` - Template
- `breadcrumb.component.scss` - Estilos

### Interfaces

```typescript
interface BreadcrumbItem {
  label: string;    // Texto a mostrar
  url: string;      // URL para navegación
  isLast: boolean;  // Si es el último elemento
}
```

## Funcionalidades

### Construcción Dinámica
El componente recorre la jerarquía de rutas activas y construye el breadcrumb basándose en:
- `data.breadcrumb` de cada ruta
- Parámetros dinámicos (ej: `:empresaId` se convierte en el valor real)

### Navegación
- Todos los elementos excepto el último son links navegables
- Usa `routerLink` para navegación del lado del cliente
- El último elemento se muestra como texto plano

### Exclusión Automática
El componente se oculta automáticamente en:
- Páginas de login
- Páginas de error (404, 403, etc.)

## Estilos

Los estilos incluyen:
- Diseño horizontal con flexbox
- Separadores con `>` 
- Efectos hover con subrayado
- Colores grises para mejor legibilidad
- Responsive design

## Personalización

### Modificar Estilos
Edita `breadcrumb.component.scss` para cambiar:
- Colores
- Espaciado
- Tipografía
- Efectos hover

### Agregar Rutas Excluidas
Modifica el método `shouldShowBreadcrumb()` en el componente:

```typescript
get shouldShowBreadcrumb(): boolean {
  const currentUrl = this.router.url;
  const excludedRoutes = ['/login', '/unauthorized', '/forbidden', '/not-found', '/tu-ruta'];
  return !excludedRoutes.some(route => currentUrl.includes(route));
}
```

## Ejemplos de Uso

### Ruta Simple
```typescript
{
  path: 'perfil',
  component: ProfileComponent,
  data: { breadcrumb: 'Mi Perfil' }
}
```
Resultado: **Inicio > Mi Perfil**

### Ruta con Parámetros
```typescript
{
  path: 'empresas/:id',
  component: CompanyComponent,
  data: { breadcrumb: 'Empresa' }
}
```
Resultado: **Inicio > Empresa** (donde "Empresa" se reemplaza con el valor real del parámetro)

### Rutas Anidadas
```typescript
{
  path: 'categorias',
  data: { breadcrumb: 'Categorías' },
  children: [
    {
      path: ':categoriaId',
      data: { breadcrumb: 'Categoría' },
      children: [
        {
          path: 'productos',
          component: ProductsComponent,
          data: { breadcrumb: 'Productos' }
        }
      ]
    }
  ]
}
```
Resultado: **Inicio > Categorías > Tecnología > Productos** 