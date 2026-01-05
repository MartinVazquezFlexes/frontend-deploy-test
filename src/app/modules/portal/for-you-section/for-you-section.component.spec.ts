import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForYouSectionComponent } from './for-you-section.component';

describe('ForYouSectionComponent', () => {
  let component: ForYouSectionComponent;
  let fixture: ComponentFixture<ForYouSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForYouSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForYouSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
