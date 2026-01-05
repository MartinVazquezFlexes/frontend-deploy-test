import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTheJobComponent } from './about-the-job.component';

describe('AboutTheJobComponent', () => {
  let component: AboutTheJobComponent;
  let fixture: ComponentFixture<AboutTheJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTheJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutTheJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
