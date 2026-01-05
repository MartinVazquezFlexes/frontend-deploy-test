import { UploadDropzoneComponent } from './../../../../shared/components/upload-dropzone/upload-dropzone.component';
import { ErrorMessageComponent } from './../../../../shared/components/error-message/error-message.component';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadContextService } from '../../../../core/services/file-upload-context.service';

@Component({
  selector: 'app-my-files',
  imports: [ErrorMessageComponent, UploadDropzoneComponent, TranslateModule],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.scss',
})
export class MyFilesComponent implements OnInit {
  selectedFile: File | null = null;
  uploadedFiles: File[] = [];

  private messageService = inject(MessageService);
  private fileUploadContextService = inject(FileUploadContextService);
  messageExists = computed(() => this.messageService._message() !== '');

  readonly allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  ngOnInit(): void {
    // Establecer el contexto como profile-data
    this.fileUploadContextService.setContext('profile-data');
  }

  getFileSize(size: number): string {
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }
}
