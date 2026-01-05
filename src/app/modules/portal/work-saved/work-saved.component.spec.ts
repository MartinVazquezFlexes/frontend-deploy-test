import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSavedComponent } from './work-saved.component';

describe('WorkSavedComponent', () => {
  let component: WorkSavedComponent;
  let fixture: ComponentFixture<WorkSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkSavedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
