import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginContainerComponent } from './login-container.component';
import { LoginLeftSideComponent } from '../login-left-side/login-left-side.component';
import { LoginRightSideComponent } from '../login-right-side/login-right-side.component';
import { TranslateModule } from '@ngx-translate/core';

describe('LoginContainerComponent', () => {
  let component: LoginContainerComponent;
  let fixture: ComponentFixture<LoginContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginContainerComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render both left and right side components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-login-left-side')).toBeTruthy();
    expect(compiled.querySelector('app-login-right-side')).toBeTruthy();
  });
});
