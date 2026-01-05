import { Component, inject, input, output, OnInit, OnDestroy, effect, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputGenericComponent } from "../input-generic/input-generic.component";
import { UploadDropzoneComponent } from '../upload-dropzone/upload-dropzone.component';
import { FileUploadContextService } from '../../../core/services/file-upload-context.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-application-form',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    TranslateModule,
    InputGenericComponent,
    UploadDropzoneComponent
],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
})
export class ApplicationFormComponent implements OnInit, OnDestroy {
  isOpen = input<boolean>(false);
  close = output<void>();

  form: FormGroup;
  isClosing = false;
  selectedFile: File | null = null;
  mockFiles: File[] = [];
  
  get shouldShowModal(): boolean {
    return this.isOpen() && !this.isClosing;
  }

  private fileUploadContextService = inject(FileUploadContextService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      cv: [null, Validators.required]
    });

    // Solo crear archivos mock en el navegador, no durante SSR
    if (typeof window !== 'undefined') {
      this.createMockFiles();
    }

    effect(() => {
      if (this.isOpen()) {
        this.fileUploadContextService.setContext('application-form');
        this.disableBodyScroll();
      } else {
        this.enableBodyScroll();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.enableBodyScroll();
  }

  private createMockFiles() {
    const mockFile1 = new File(
      [new Blob(['contenido del CV de Agustín'], { type: 'application/pdf' })],
      'CV-AGUSTIN.PDF',
      { type: 'application/pdf', lastModified: Date.now() }
    );

    const mockFile2 = new File(
      [new Blob(['contenido del CV nuevo de Agustín'], { type: 'application/pdf' })],
      'CV-AGUSTIN-NUEVO.PDF',
      { type: 'application/pdf', lastModified: Date.now() }
    );

    Object.defineProperty(mockFile1, 'size', { value: 1400000, writable: false }); 
    Object.defineProperty(mockFile2, 'size', { value: 1600000, writable: false }); 

    this.mockFiles = [mockFile1, mockFile2];
  }

  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.resetForm();
      this.close.emit();
    }, 350); 
  }

  onSubmit(): void {
    if (this.form.valid && this.selectedFile) {
      console.log('Formulario enviado:', this.form.value);
      console.log('Archivo seleccionado:', this.selectedFile);
      alert('Solicitud enviada con éxito');
      this.closeModal();
    } else {
      this.form.markAllAsTouched();
      console.log('Formulario inválido o falta archivo');
    }
  }

  onFileUploaded(file: File | null) {
    this.selectedFile = file;
    this.form.get('cv')?.setValue(file);
    this.form.get('cv')?.updateValueAndValidity();
  }

  onFileSelected(file: File | null) {
    this.selectedFile = file;
    this.form.get('cv')?.setValue(file);
    this.form.get('cv')?.updateValueAndValidity();
  }

  private resetForm() {
    this.form.reset();
    this.selectedFile = null;
  }

  private disableBodyScroll() {
    this.renderer.addClass(this.document.body, 'modal-open');
  }

  private enableBodyScroll() {
    this.renderer.removeClass(this.document.body, 'modal-open');
  }
}




