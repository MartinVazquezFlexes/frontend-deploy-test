import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTestComponent } from './section-test.component';

describe('SectionTestComponent', () => {
  let component: SectionTestComponent;
  let fixture: ComponentFixture<SectionTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
