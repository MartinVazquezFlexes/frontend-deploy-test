# Patrón Strategy para Login

Este directorio contiene la implementación del patrón Strategy para manejar diferentes tipos de autenticación.

## Estructura

- `login-strategy.interface.ts` - Interfaz base para todas las estrategias
- `login-strategy-factory.ts` - Factory para crear estrategias según el tipo
- `login-context.service.ts` - Contexto que maneja las estrategias
- `email-login.strategy.ts` - Estrategia para login con email/password
- `linkedin-login.strategy.ts` - Estrategia para login con LinkedIn OAuth

## Uso

### En el SecurityService

```typescript
// Login con email/password
loginWithEmail(email: string, password: string, role: string): Observable<LoginResponseDTO> {
  this.loginContext.setStrategy(LoginType.EMAIL);
  return this.loginContext.login({ email, password, role });
}

// Login con LinkedIn
async loginWithLinkedIn(): Promise<void> {
  await this.loginContext.loginWithOAuth(LoginType.LINKEDIN);
}
```

### En los componentes

```typescript
// Login con email
this.authService.loginWithEmail(email, password, role).subscribe({
  next: (response) => {
    // Manejar login exitoso
  },
  error: (error) => {
    // Manejar error
  }
});

// Login con OAuth
try {
  await this.authService.loginWithLinkedin();
  // Login exitoso
} catch (error) {
  // Manejar error
}
```

## Configuración

### 1. Configurar environment.ts

Las configuraciones de OAuth deben estar en `environment.ts`:

```typescript
export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  oauth: {
    linkedin: {
      clientId: 'tu-linkedin-client-id', 
      redirectUri: 'http://localhost:4200/auth/callback'
    }
  }
};
```

### 2. Obtener credenciales OAuth
**LinkedIn OAuth:**
1. Ve a https://www.linkedin.com/developers/
2. Crea una nueva aplicación
3. Configura las URLs de redirección autorizadas
4. Copia el Client ID

### 3. Verificar endpoints del backend

Asegúrate de que estos endpoints estén implementados en tu backend:
- `POST /auth/email-login` (ya implementado)
- `POST /auth/linkedin-login` (necesita implementarse)

Todos deben devolver la misma estructura `LoginResponseDTO`.

## Agregar nuevas estrategias

1. Crear nueva estrategia implementando `LoginStrategy`
2. Agregar el tipo en `LoginType` enum
3. Agregar la estrategia en `LoginStrategyFactory`
4. Agregar configuración en environment si es necesario
5. Agregar método en `SecurityService`

## Ventajas del patrón Strategy

- **Extensibilidad**: Fácil agregar nuevos tipos de login
- **Mantenibilidad**: Cada estrategia está aislada
- **Testabilidad**: Cada estrategia puede ser testeada independientemente
- **Reutilización**: Las estrategias pueden ser reutilizadas en diferentes contextos 