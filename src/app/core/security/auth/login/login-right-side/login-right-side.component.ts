import { Component, inject, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { InputGenericComponent } from "../../../../../shared/components/input-generic/input-generic.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SecurityService } from '../../services/security.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginResponseDTO } from '../../auth.login';

@Component({
  selector: 'app-login-right-side',
  standalone: true,
  imports: [TranslateModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './login-right-side.component.html',
  styleUrl: './login-right-side.component.scss'
})
export class LoginRightSideComponent implements OnDestroy {
  showPassword?: boolean;
  eyeIconUrl = '/assets/img/eye-cross.svg';
  private authService = inject(SecurityService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  
  loading: boolean = false;
  errorMessage?: string;
  successMessage?: string;
  rol: string = 'RECRUITER';

  loginForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    rol: new FormControl('RECRUITER', [Validators.required])
  });

  constructor() {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.errorMessage) {
          this.errorMessage = '';
        }
        if (this.successMessage) {
          this.successMessage = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loginWithGoogle() {
    try {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      await this.authService.loginWithGoogle();
      
      // Mostrar mensaje de éxito
      this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo...';
      this.loading = false;
      
      // Redirigir después de mostrar el mensaje
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    } catch (error) {
      this.errorMessage = 'Error durante el inicio de sesión con Google. Por favor, intenta nuevamente.';
      console.error('Google login error:', error);
      this.loading = false;
    }
  }

  async loginWithLinkedin() {
    try {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      await this.authService.loginWithLinkedIn();

      this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo...';
      this.loading = false;
      
      // Redirigir después de mostrar el mensaje
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    } catch (error) {
      this.errorMessage = 'Error durante el inicio de sesión con LinkedIn. Por favor, intenta nuevamente.';
      console.error('LinkedIn login error:', error);
      this.loading = false;
    }
  }	
  onSubmitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rol } = this.loginForm.value;
    
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true; 
    
    this.authService.loginWithEmail(email, password, rol)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: LoginResponseDTO) => {
          // Usar el método centralizado del servicio
          this.authService.handleSuccessfulLogin(response);
          
          // Mostrar mensaje de éxito
          this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo...';
          this.loading = false;
          
          // Redirigir después de mostrar el mensaje
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        },
        error: (err) => {
          console.error('Login error:', err);
          
          // Manejo específico de errores según el tipo
          if (err.status) {
            this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
          } else if (err?.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Error inesperado. Por favor, intenta nuevamente.';
          }
          
          this.loading = false;
        }
      });
  }

  isFieldTouched(field: string): boolean {
    return this.loginForm?.get(field)?.touched ?? false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.eyeIconUrl = this.showPassword ? '/assets/img/eye.svg' : '/assets/img/eye-cross.svg';
  }

}
