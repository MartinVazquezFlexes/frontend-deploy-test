import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  computed,
} from '@angular/core';
import { FileUploadContextService } from '../../../../core/services/file-upload-context.service';

@Component({
  selector: 'app-file-uploaded',
  imports: [],
  templateUrl: './file-uploaded.component.html',
  styleUrl: './file-uploaded.component.scss',
})
export class FileUploadedComponent {
  files: File[] = [];
  selectedFileIndex: number | null = null;
  
  private fileUploadContextService = inject(FileUploadContextService);

  @Input() size: 'small' | 'medium' | 'large' = 'large'; // Tamaño por defecto
  @Output() duplicatedFile = new EventEmitter<boolean>();
  @Output() fileSelected = new EventEmitter<File | null>();

  // Computed signals que reaccionan automáticamente a cambios en el contexto
  isApplicationForm = computed(() => {
    return this.fileUploadContextService.context() === 'application-form';
  });

  isProfileData = computed(() => {
    return this.fileUploadContextService.context() === 'profile-data';
  });

  @Input()
  set mockFiles(files: File[]) {
    if (files && files.length > 0) {
      this.files = [...files];
    }
  }

  @Input()
  set newFile(file: File | null) {
    if (!file) return;

    const fileExists = this.files.some((f) => f.name === file.name);
    if (fileExists) {
      this.duplicatedFile.emit(true);
    } else {
      this.files.push(file);
      this.duplicatedFile.emit(false);
    }
  }



  removeUploadedFile(index: number): void {
    this.files.splice(index, 1);
    // Si se elimina el archivo seleccionado, resetear la selección
    if (this.selectedFileIndex === index) {
      this.selectedFileIndex = null;
      this.fileSelected.emit(null);
    } else if (this.selectedFileIndex !== null && this.selectedFileIndex > index) {
      // Ajustar el índice si se eliminó un archivo anterior al seleccionado
      this.selectedFileIndex--;
    }
  }

  selectFile(index: number): void {
    if (this.isApplicationForm()) {
      this.selectedFileIndex = index;
      this.fileSelected.emit(this.files[index]);
    }
  }

  getFileSize(size: number): string {
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }
}
