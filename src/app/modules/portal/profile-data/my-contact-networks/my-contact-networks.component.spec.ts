import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContactNetworksComponent } from './my-contact-networks.component';

describe('MyContactNetworksComponent', () => {
  let component: MyContactNetworksComponent;
  let fixture: ComponentFixture<MyContactNetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyContactNetworksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyContactNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
