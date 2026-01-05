import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDropzoneComponent } from './upload-dropzone.component';

describe('UploadDropzoneComponent', () => {
  let component: UploadDropzoneComponent;
  let fixture: ComponentFixture<UploadDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDropzoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
