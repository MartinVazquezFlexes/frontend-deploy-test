import { Component, inject, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MessageService } from '../../../core/services/message.service';
import { FileUploadedComponent } from './file-uploaded/file-uploaded.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-dropzone',
  imports: [NgxDropzoneModule, ButtonComponent, FileUploadedComponent, TranslateModule],
  templateUrl: './upload-dropzone.component.html',
  styleUrl: './upload-dropzone.component.scss',
})
export class UploadDropzoneComponent {
  selectedFile: File | null = null;
  fileUploaded: File | null = null;
  errorMessage:string='';

  @Input() mockFiles: File[] = [];
  @Input() size: 'small' | 'medium' | 'large' = 'large'; // Tamaño por defecto
  @Output() fileUploadedEvent = new EventEmitter<File | null>();
  @Input()
  set resetToken(_: number) {
    this.resetAll();
  }


  @ViewChild(FileUploadedComponent)
  fileUploadedChild!: FileUploadedComponent;

  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  readonly allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  onSelect(event: any): void {
    const file: File = event.addedFiles[0];

    if (!this.allowedTypes.includes(file.type)) {
      this.errorMessage=this.translate.instant('FILE_UPLOAD.ERROR.ERROR_TYPE_FILE')
      this.messageService.setMessage(this.errorMessage);
      this.selectedFile = null;
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage=this.translate.instant('FILE_UPLOAD.ERROR.ERROR_TOO_LARGE');
      this.messageService.setMessage(this.errorMessage);
      this.selectedFile = null;
      return;
    }
    this.messageService.setMessage('');
    this.selectedFile = file;
  }

  onAccept() {
  if (!this.selectedFile) return;

  this.fileUploaded = this.selectedFile;
  this.fileUploadedEvent.emit(this.selectedFile);
  this.selectedFile = null;
}

  duplicatedFile(duplicated: boolean) {
    if (duplicated) {
      this.errorMessage=this.translate.instant('FILE_UPLOAD.ERROR.ERROR_DUPLICATE_FILE');
      this.messageService.setMessage(this.errorMessage);
    }
  }

  onFileSelected(file: File | null) {
    // Manejar selección de archivo cuando se usa radio buttons
    this.fileUploadedEvent.emit(file);
  }

  onRemove() {
    this.selectedFile = null;
    this.messageService.setMessage('');
  }

  getFileSize(size: number): string {
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  clearUploadedFiles : boolean = false;

  private resetAll(): void {
  this.selectedFile = null;
  this.fileUploaded = null;
  this.messageService.setMessage('');

  //avisar al hijo que limpie su lista
  this.clearUploadedFiles = true;
    setTimeout(() => this.clearUploadedFiles = false);
  }

}
