import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-about-the-job-info',
  imports: [],
  templateUrl: './about-the-job-info.component.html',
  styleUrl: './about-the-job-info.component.scss'
})
export class AboutTheJobInfoComponent {
  @Input() class: string = "";
  @Input() subtitle: string = "";
  @Input() description: string = ``;
}
