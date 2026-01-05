import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function decodeBase64(base64String: string): any {
  const decodedString = atob(base64String);
  return JSON.parse(decodedString);
}

export function extractHashFromUrl(): string | null {
  // Verificar si estamos en el navegador antes de acceder a window.location
  if (typeof window === 'undefined') {
    return null;
  }
  
  const hash = window.location.hash;
  const hashContent = hash.substring(1);

  if (hashContent) {
    return hashContent;
  }
  return null;
}
