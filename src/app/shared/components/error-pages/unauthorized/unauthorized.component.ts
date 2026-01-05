import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-unauthorized',
  imports: [TranslateModule, ButtonComponent],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  private router = inject(Router);

  goToLogin(): void {
    this.router.navigate(['/']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
} 