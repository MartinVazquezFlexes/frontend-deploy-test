## Descripción

El `PageComponent` es un componente reutilizable diseñado para manejar los indices de la paginacion de una lista, cualquiera sea su contenido.
En base tal lista se deben proporcionar los valores de entrada. Estos valores van a servir como referencia para que el componente padre sepa en que pagina se quiere situar el usuario y como se muestra visualmente el `PageComponent`. 

Si el total de paginas de la lista que queremos mostrar es mayor a 20, El componente muestra flechas que nos permite cambiar el indice.

Si el total de paginas de la lista que queremos mostrar es menor a 5, El componente muestra el total de numeros de paginas (Ejemplo: 2 3 4 5), en cambio si es mayor a 5 esconde los numeros intermedios (Ejemplo: 1 2 3 ... 10)

## Instalación

El componente está disponible como parte del sistema de diseño. No requiere instalación adicional.


### Inputs

| Input           | Tipo           | Requerido | Descripción                                                                 |
|----------------|----------------|-----------|-----------------------------------------------------------------------------|
| `totalItems`      | `number`  | ✅ Sí     | Es el tamaño de la lista que vamos a querer mostrar.                       |
| `itemsPerPage`       | `number`      | No        | Cantidad de items que va a tener cada pagina. Por defecto: `10`.                      |
| `actualPage`| `number`      | No        | Pagina en la que queremos que se situe el paginador. Por defecto: `0`, es un model por lo tengo podemos adquirir el valor desde el padre si quisieramos asignarlo a una variable.                  |

### Outputs

| output           | Tipo           |  Descripción                                                                 |
|----------------|---------------------------|-----------------------------------------------------------------------------|
| `pageChanged`      | `number`  |  Emite el numero en el que se quiere situar el usuario, exactamente, no el indice. Por ejemplo si se situa en la pagina `2`, exactamente emite `2`, (El indice seria 1)                      |

## Uso

### Importación

```typescript
import { PagerComponent } from '@/shared/components/pager/pager.component';
```

### Ejemplos Básicos

#### Variantes



```html
<!-- Pager con todas las variables -->
<app-pager 
    [itemsPerPage]="1" 
    [totalItems]="20"
    [actualPage]="0"
    (pageChanged)="onPageChanged($event)"
    >
</app-pager>
<!-- Pager con  variables requeridas -->
<app-pager  
    [totalItems]="20"
    (pageChanged)="onPageChanged($event)"
    >
</app-pager>

```

