import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTheJobInfoComponent } from './about-the-job-info.component';

describe('AboutTheJobInfoComponent', () => {
  let component: AboutTheJobInfoComponent;
  let fixture: ComponentFixture<AboutTheJobInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTheJobInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutTheJobInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
