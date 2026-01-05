import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailHeaderInfoComponent } from './job-detail-header-info.component';

describe('JobDetailHeaderInfoComponent', () => {
  let component: JobDetailHeaderInfoComponent;
  let fixture: ComponentFixture<JobDetailHeaderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetailHeaderInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
