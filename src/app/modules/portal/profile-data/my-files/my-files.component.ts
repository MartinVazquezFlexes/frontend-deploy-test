import { UploadDropzoneComponent } from './../../../../shared/components/upload-dropzone/upload-dropzone.component';
import { ErrorMessageComponent } from './../../../../shared/components/error-message/error-message.component';
import { Component, computed, inject, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadContextService } from '../../../../core/services/file-upload-context.service';
import { CvItem, UploadedFile } from '../../../../core/interfaces/cv.interface';
import { ProfileDataService } from '../service/profile-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-files',
  imports: [ErrorMessageComponent, UploadDropzoneComponent, TranslateModule, CommonModule],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.scss',
})
export class MyFilesComponent implements OnInit {
  selectedFile: File | null = null;
  uploadedFiles: File[] = [];

  @Input() personId: number = 0;
  cvs: CvItem[] = [];
  mockFiles: UploadedFile[] = [];
  fileUploaded?: UploadedFile;
  size: 'small' | 'medium' | 'large' = 'medium';

  private profileDataService = inject(ProfileDataService);

  @Output() fileSelected = new EventEmitter<File>();
  @Output() componentReady = new EventEmitter<void>();
  @Input() resetUploaderToken = 0;

  @ViewChild(UploadDropzoneComponent)
  uploadDropzone!: UploadDropzoneComponent;

  private messageService = inject(MessageService);
  private fileUploadContextService = inject(FileUploadContextService);
  messageExists = computed(() => this.messageService._message() !== '');

  readonly allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  ngOnInit(): void {
    this.fileUploadContextService.setContext('profile-data');
    this.loadMyCvs();
  }

loadMyCvs(): void {
  // Opción 1: Pasar false para obtener todos
  this.profileDataService.getMyCvs(this.personId).subscribe({
    next: page => {
      this.mockFiles = page.content.map((cv: any) => ({
        id: cv.id,
        name: cv.name,
        url: cv.cvUrl,
        createdAt: cv.creationDate,
        isLast: cv.isLast
      }));
      console.log('CVs cargados:', this.mockFiles);
      this.componentReady.emit();
    },
    error: err => {
      console.error('Error al cargar CVs:', err);
      this.messageService.setMessage('Error al cargar los archivos');
    }
  });
}

onFileSelected(file: UploadedFile) {
  if (!file.id) {
    this.messageService.setMessage('Archivo inválido');
    return;
  }

  const url = this.profileDataService.downloadCvUrl(file.id);
  window.open(url, '_blank');
}


  onDeleteFile(file: UploadedFile) {
    if (!file.id) {
      console.error('El archivo no tiene ID');
      return;
    }

    // Confirmación antes de eliminar
    const confirmDelete = confirm(`¿Está seguro que desea eliminar el archivo "${file.name}"?`);
    
    if (!confirmDelete) {
      return;
    }

    // Llamar al servicio para eliminar
    this.profileDataService.deleteCv(this.personId, file.id).subscribe({
      next: (result) => {
        if (result) {
          console.log('Archivo eliminado exitosamente');
          this.messageService.setMessage('Archivo eliminado correctamente');
          // Recargar la lista
          this.loadMyCvs();
        } else {
          console.error('No se pudo eliminar el archivo');
          this.messageService.setMessage('Error al eliminar el archivo');
        }
      },
      error: (err) => {
        console.error('Error al eliminar el archivo:', err);
        this.messageService.setMessage('Error al eliminar el archivo');
      }
    });
  }

  getFileSize(size: number): string {
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }


  onFileUploaded(file: File | null) {
  if (!file) return;

  this.selectedFile = file;
  this.fileSelected.emit(file);

  setTimeout(() => {
    this.loadMyCvs();
  }, 1000);
}

}