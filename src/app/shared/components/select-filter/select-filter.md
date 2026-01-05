# Select Filter Component

## Descripción

El componente `SelectFilterComponent` es un selector desplegable simple, ideal para filtros de varias opciones. Permite seleccionar varias opciones (algunas pueden estar deshabilitadas), mantiene el estado visual de la opción seleccionada y cierra automáticamente el menú al hacer clic fuera del componente. Está desarrollado con Angular Standalone Components, SCSS modular con metodología BEM y es completamente desacoplado y reutilizable.

## Instalación

Este componente es parte del sistema de diseño del proyecto. No requiere instalación adicional si ya está incluido en tu base de código.

## API

### Variables internas

| Nombre           | Tipo          | Descripción                                                |
|------------------|---------------|------------------------------------------------------------|
| `options`        | `OptionItem[]`| Lista de opciones para seleccionar                         |
| `selectedOption` | `string`      | Texto de la opción actualmente seleccionada                |
| `isDropdownOpen` | `boolean`     | Controla la visibilidad del dropdown                       |
| `hasSelection`   | `boolean`     | Indica si se ha seleccionado una opción distinta a la predeterminada |

### Métodos

| Nombre             | Descripción                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `toggleDropdown()` | Abre o cierra el dropdown al hacer clic en el contenedor principal          |
| `selectOption()`   | Selecciona una opción si no está deshabilitada y cierra el dropdown         |
| `handleClickOutside()` | Cierra el dropdown si el clic se realiza fuera del componente (sólo en navegador) |

## Uso

### Importación

```typescript
import { SelectFilterComponent } from './select-filter.component';





Ejemplo de uso

<app-select-filter></app-select-filter>

Variables SCSS utilizadas
$color-default: #2e2473;
$color-dark: #1f2937;
$color-dark-gray: #6b7280;
$color-gray-200: #e5e7eb;
$color-gray-300: #d1d5db;
$color-green: #a3e635;
$color-background: #ffffff;


Comportamiento y accesibilidad

Cierre automático al hacer clic fuera del dropdown (HostListener).

Opción deshabilitada con pointer-events: none y estilo visual claro.

Usa clases --selected y --disabled para marcar el estado de cada opción.

Visualización clara del estado de selección con texto dinámico.


```