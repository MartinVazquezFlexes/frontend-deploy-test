import { Injectable, signal } from '@angular/core';

export type FileUploadContext = 'profile-data' | 'application-form';

@Injectable({
  providedIn: 'root'
})
export class FileUploadContextService {
  private _context = signal<FileUploadContext>('profile-data');

  get context() {
    return this._context.asReadonly();
  }

  setContext(context: FileUploadContext) {
    this._context.set(context);
  }

  get isApplicationForm(): boolean {
    return this._context() === 'application-form';
  }

  get isProfileData(): boolean {
    return this._context() === 'profile-data';
  }
} 