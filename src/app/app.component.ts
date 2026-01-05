import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LinkedInLoginStrategy } from './core/security/auth/strategies/linkedin-login.strategy';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  router = inject(Router);
  private linkedInStrategy = inject(LinkedInLoginStrategy);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && window.location.hash) {
      this.linkedInStrategy.processLinkedInCallback();
      this.router.navigate(['/']);
    }
  }

  get showHeaderFooter(): boolean {
    return !(this.router.url === '/' || this.router.url === '');
  }
}
