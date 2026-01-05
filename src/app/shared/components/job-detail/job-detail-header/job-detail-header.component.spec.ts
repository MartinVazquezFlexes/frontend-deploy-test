import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailHeaderComponent } from './job-detail-header.component';

describe('JobDetailHeaderComponent', () => {
  let component: JobDetailHeaderComponent;
  let fixture: ComponentFixture<JobDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetailHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
