import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginRightSideComponent } from './login-right-side.component';
import { provideRouter, Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputGenericComponent } from '../../../../../shared/components/input-generic/input-generic.component';
import { CommonModule } from '@angular/common';
import { LoginResponseDTO } from '../../auth.login';

describe('LoginRightSideComponent', () => {
  let component: LoginRightSideComponent;
  let fixture: ComponentFixture<LoginRightSideComponent>;
  let mockSecurityService: jasmine.SpyObj<SecurityService>;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    mockSecurityService = jasmine.createSpyObj('SecurityService', ['loginWithEmail', 'openAuthPopup']);

    await TestBed.configureTestingModule({
      imports: [
        LoginRightSideComponent,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        ButtonComponent,
        InputGenericComponent,
        CommonModule,
      ],
      providers: [
        { provide: SecurityService, useValue: mockSecurityService },
        provideRouter([]), 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginRightSideComponent);
    component = fixture.componentInstance;

    const router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    component.showPassword = false;
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
    expect(component.eyeIconUrl).toBe('/assets/img/eye.svg');

    component.togglePassword();
    expect(component.showPassword).toBeFalse();
    expect(component.eyeIconUrl).toBe('/assets/img/Vector.svg');
  });

  it('should show error message when Google login fails', async () => {
    mockSecurityService.openAuthPopup.and.rejectWith('Google error');
    await component.loginWithGoogle();
    expect(component.errorMessage).toContain('Error during Google login');
    expect(component.loading).toBeFalse();
  });

  it('should call loginWithEmail and navigate on successful login', () => {
    const mockResponse: LoginResponseDTO = {
      jwt: { 
        token: 'fake-token' 
      },
      user: { 
        id: 1, 
        email: 'test@mail.com'
      }
    };

    mockSecurityService.loginWithEmail.and.returnValue(of(mockResponse));
    component.loginForm.setValue({ email: 'test@mail.com', password: '12345678', rol: 'USER' });

    component.onSubmitLogin();

    expect(mockSecurityService.loginWithEmail).toHaveBeenCalledWith('test@mail.com', '12345678', 'ADMIN');
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toContain('Test User');
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should show error when loginWithEmail fails', () => {
    const errorResponse = {
      error: { message: 'Invalid credentials' }
    };

    mockSecurityService.loginWithEmail.and.returnValue(throwError(() => errorResponse));
    component.loginForm.setValue({ email: 'test@mail.com', password: '12345678', rol: 'USER' });

    component.onSubmitLogin();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.loading).toBeFalse();
  });

  it('should mark fields as touched if form is invalid', () => {
    spyOn(component.loginForm, 'markAllAsTouched');

    component.onSubmitLogin();

    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('isFieldTouched should return true if touched', () => {
    component.loginForm.get('email')?.markAsTouched();
    expect(component.isFieldTouched('email')).toBeTrue();
  });
});