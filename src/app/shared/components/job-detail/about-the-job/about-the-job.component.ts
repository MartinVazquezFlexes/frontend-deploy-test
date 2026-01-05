import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-the-job',
  imports: [TranslateModule],
  templateUrl: './about-the-job.component.html',
  styleUrl: './about-the-job.component.scss'
})
export class AboutTheJobComponent {
  description = input.required<string>();
  responsibilities = input.required<string[]>();
  requirements = input.required<string[]>();
  benefits = input.required<string[]>();
  jobDescription = input<string>("En TECHFORB  continuamos ampliando nuestro Equipo de Desarrolladores PHP. En esta ocasion nos encontramos en la busqueda de un especialista en desarrollo. Si coincidis con los requisitos expuestos esperamos tu postulacion!!");
  aboutTheJobData = input<any[]>();
}
