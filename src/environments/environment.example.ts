import { Environment } from './environment.types';

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
};

/*
INSTRUCCIONES PARA CONFIGURAR OAUTH:

1. GOOGLE OAUTH:
   - Ve a https://console.developers.google.com/
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la API de Google+ 
   - Ve a "Credenciales" y crea una nueva credencial OAuth 2.0
   - Configura las URIs de redirección autorizadas
   - Copia el Client ID y configúralo en environment.ts

2. LINKEDIN OAUTH:
   - Ve a https://www.linkedin.com/developers/
   - Crea una nueva aplicación
   - Configura las URLs de redirección autorizadas
   - Copia el Client ID y configúralo en environment.ts

3. ACTUALIZA environment.ts:
   - Reemplaza 'tu-google-client-id-aqui' con tu Client ID real de Google
   - Reemplaza 'tu-linkedin-client-id-aqui' con tu Client ID real de LinkedIn
   - Ajusta las redirectUri según tu configuración

4. VERIFICA LOS ENDPOINTS DEL BACKEND:
   - /auth/email-login (ya implementado)
   - /auth/google-login (necesita implementarse)
   - /auth/linkedin-login (necesita implementarse)
*/ 