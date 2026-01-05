import { Component, input } from '@angular/core';

@Component({
  selector: 'app-job-detail-header-info',
  imports: [],
  templateUrl: './job-detail-header-info.component.html',
  styleUrl: './job-detail-header-info.component.scss'
})
export class JobDetailHeaderInfoComponent {
  class = input<string>('');
  description = input<string>('');
}
