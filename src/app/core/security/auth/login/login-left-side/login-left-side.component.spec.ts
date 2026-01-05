import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginLeftSideComponent } from './login-left-side.component';
import { TranslateModule } from '@ngx-translate/core';

describe('LoginLeftSideComponent', () => {
  let component: LoginLeftSideComponent;
  let fixture: ComponentFixture<LoginLeftSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginLeftSideComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginLeftSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
