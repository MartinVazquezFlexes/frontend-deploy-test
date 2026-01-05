import { Component, HostListener, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-links',
  imports: [TranslateModule, RouterLink],
  templateUrl: './header-links.component.html',
  styleUrl: './header-links.component.scss'
})
export class HeaderLinksComponent implements OnInit {

    isDropdownOpen = false;

    private translate = inject(TranslateService);
    private router = inject(Router);

    ngOnInit() {
      this.translate.addLangs(['en', 'es', 'pt']);
    }
  
    switchLanguage(lang: string) {
      this.translate.use(lang);
    }

    toggleDropdown(event: Event): void {
      event.preventDefault();
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        this.isDropdownOpen = false;
      }
    }
  
    logout(): void {
      console.log('Cerrar sesión');
      this.isDropdownOpen = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
}
