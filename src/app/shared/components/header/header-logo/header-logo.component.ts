import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-logo',
  imports: [],
  templateUrl: './header-logo.component.html',
  styleUrl: './header-logo.component.scss'
})
export class HeaderLogoComponent {

  private router = inject(Router);

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

}
