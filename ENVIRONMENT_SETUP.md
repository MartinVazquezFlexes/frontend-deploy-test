# Environment Setup - Techforb Recruiting Frontend

## Descripción General

Este proyecto utiliza diferentes archivos de environment para manejar configuraciones específicas según el entorno de ejecución (desarrollo, producción, etc.). **Las variables sensibles se manejan de forma segura a través de variables de entorno de Netlify.**

## Estructura de Archivos

```
src/environments/
├── environment.ts          # Archivo base (no se usa directamente)
├── environment.dev.ts      # Configuración para desarrollo (placeholders)
├── environment.prod.ts     # Configuración para producción (placeholders)
└── environment.example.ts  # Archivo de ejemplo

netlify-build.js            # Script para generar environments dinámicamente
netlify.toml               # Configuración de Netlify
```

## Configuración por Entorno

### Desarrollo (`environment.dev.ts`)
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'API_DEV',
};
```

### Producción (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'API_PROD'
};
```

## 🔒 Configuración Segura para Netlify

### Variables de Entorno en Netlify

Configura las siguientes variables en tu dashboard de Netlify:

1. Ve a **Site settings** → **Environment variables**
2. Agrega las variables:

| Variable | Valor |
|----------|-------|
| `API_DEV` | `https://techforb-recruting-backend.onrender.com/api` |
| `API_PROD` | `https://techforb-recruting-backend.onrender.com/api` |

### Script de Build Automático

El archivo `netlify-build.js` se ejecuta automáticamente durante el build y:

1. Lee las variables de entorno de Netlify
2. Genera dinámicamente los archivos `environment.dev.ts` y `environment.prod.ts`
3. Reemplaza los placeholders con los valores reales
4. Continúa con el build de Angular

### Configuración de Netlify

El archivo `netlify.toml` configura:

```toml
[build]
  command = "npm run build:netlify"
  publish = "dist/techforb-recruiting-frontend"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Configuración en Angular

El archivo `angular.json` está configurado para usar automáticamente los archivos correctos según el entorno:

### Para Desarrollo
```json
"development": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.dev.ts"
    }
  ]
}
```

### Para Producción
```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
}
```

## Comandos de Ejecución

### Desarrollo Local
```bash
ng serve
# o explícitamente:
ng serve --configuration=development
```

### Build de Desarrollo
```bash
ng build --configuration=development
# o:
npm run build:dev
```

### Build de Producción (Local)
```bash
ng build
# o explícitamente:
ng build --configuration=production
```

### Build para Netlify
```bash
npm run build:netlify
```

## Variables de Environment Disponibles

### `production`
- **Tipo**: `boolean`
- **Descripción**: Indica si la aplicación está en modo producción
- **Valores**: 
  - `false` en desarrollo
  - `true` en producción

### `apiBaseUrl`
- **Tipo**: `string`
- **Descripción**: URL base de la API del backend
- **Valores**: 
  - Se reemplaza dinámicamente durante el build de Netlify
  - Usa `API_DEV` en desarrollo
  - Usa `API_PROD` en producción

## Cómo Usar en el Código

### Importar Environment
```typescript
import { environment } from '../environments/environment';

// Usar variables
console.log('API URL:', environment.apiBaseUrl);
console.log('Is Production:', environment.production);
```

### Ejemplo de Servicio
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.apiUrl}/endpoint`);
  }
}
```

## 🔒 Seguridad

### Archivos Ignorados

Los archivos de environment están en `.gitignore` para evitar que se committeen con valores sensibles:

```
src/environments/environment.dev.ts
src/environments/environment.prod.ts
```

### Flujo Seguro

1. **GitHub**: Solo contiene placeholders (`API_DEV`, `API_PROD`)
2. **Netlify**: Contiene las variables de entorno reales
3. **Build**: El script reemplaza placeholders con valores reales
4. **Deploy**: La aplicación se despliega con los valores correctos

## Personalización

### Agregar Nuevas Variables

1. **Agregar la variable en Netlify:**
   - Ve a Site settings → Environment variables
   - Agrega la nueva variable (ej: `NEW_API_KEY`)

2. **Modificar el script `netlify-build.js`:**
```javascript
const newApiKey = process.env.NEW_API_KEY || 'default-value';

const devContent = `export const environment = {
  production: false,
  apiBaseUrl: '${apiDev}',
  newApiKey: '${newApiKey}'
};`;
```

3. **Actualizar los archivos de environment con placeholders:**
```typescript
// environment.dev.ts
export const environment = {
  production: false,
  apiBaseUrl: 'API_DEV',
  newApiKey: 'NEW_API_KEY'
};
```

### Cambiar URLs de API

Para cambiar las URLs de API:

1. **En Netlify**: Actualiza las variables `API_DEV` y `API_PROD`
2. **No necesitas tocar el código**: Los cambios se aplican automáticamente en el próximo deploy

## Verificación

### Verificar qué archivo se está usando

Para verificar qué archivo de environment se está cargando:

```typescript
import { environment } from '../environments/environment';

console.log('Environment loaded:', environment);
console.log('Production mode:', environment.production);
console.log('API URL:', environment.apiBaseUrl);
```

### Verificar en Netlify

1. Ve a tu deploy en Netlify
2. En los logs de build, deberías ver:
   ```
   🚀 Starting Netlify build process...
   📡 API URLs configured:
     Development: https://your-dev-api.com/api
     Production: https://your-prod-api.com/api
   ✅ Environment files updated successfully
   ```

### Verificar en el navegador

1. Abrir las herramientas de desarrollador (F12)
2. Ir a la pestaña Console
3. Ejecutar el código de verificación anterior
4. Confirmar que los valores corresponden al entorno esperado

## Troubleshooting

### Problema: No se cargan las variables correctas

**Solución:**
1. Verificar que las variables están configuradas en Netlify
2. Verificar que el `netlify.toml` está en la raíz del proyecto
3. Verificar que el script `netlify-build.js` existe
4. Revisar los logs de build en Netlify

### Problema: Error de compilación

**Solución:**
1. Verificar que todos los archivos de environment tienen la misma estructura
2. Asegurar que no hay errores de sintaxis en los archivos TypeScript
3. Verificar que las importaciones son correctas
4. Verificar que el script `netlify-build.js` no tiene errores

### Problema: Variables no se reemplazan

**Solución:**
1. Verificar que las variables de entorno están configuradas en Netlify
2. Verificar que los nombres de las variables coinciden exactamente
3. Verificar que el script se está ejecutando (revisar logs de build)

## Notas Importantes

- ✅ **Seguro**: Las variables sensibles nunca se committean a GitHub
- ✅ **Automático**: El proceso es completamente automático en Netlify
- ✅ **Flexible**: Fácil de cambiar valores sin tocar código
- ✅ **Trazable**: Los logs muestran qué valores se están usando
- ✅ **Contextual**: Diferentes valores para diferentes contextos (preview, production)

## Flujo de Deploy

1. **Push a GitHub** → Netlify detecta cambios
2. **Netlify ejecuta** → `npm run build:netlify`
3. **Script lee** → Variables de entorno de Netlify
4. **Script genera** → Archivos de environment con valores reales
5. **Angular build** → Usa los archivos generados
6. **Deploy** → Aplicación con configuración correcta
