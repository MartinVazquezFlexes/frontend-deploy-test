import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private translate: TranslateService) {

    this.translate.addLangs(['en', 'es', 'pt']);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
