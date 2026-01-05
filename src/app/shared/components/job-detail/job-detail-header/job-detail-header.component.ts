import { Component, input, output } from '@angular/core';
import { JobDetailHeaderInfoComponent } from "./job-detail-header-info/job-detail-header-info.component";
import { ButtonComponent } from "../../button/button.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-job-detail-header',
  imports: [JobDetailHeaderInfoComponent, ButtonComponent,TranslateModule],
  templateUrl: './job-detail-header.component.html',
  styleUrl: './job-detail-header.component.scss'
})
export class JobDetailHeaderComponent {
  openApplicationFormModal = output<void>();
  job = input.required<any>();
  jobData = input<JobDetailData>({imgSource: "", companyName: "Techforb", jobTitle: "FullStack Developer"});
  headerData = input<any[]>([
    {class: "header__location", description: "Buenos Aires, Argentina"},
    {class: "header__job-type", description: "Presencial - Jornada Completa"},
    {class: "header__post-time", description: "Hace 2 horas"}
  ]);
  secondaryActionsData = [
    {
      class: "actions__copy",
      img: "assets/img/copy-icon.svg",
      alt: "copy"
    },
    {
      class: "actions__save",
      img: "assets/img/save-icon.svg",
      alt: "save"
    },
    {
      class: "actions__extra",
      img: "assets/img/tresPuntos.svg",
      alt: "extra"
    }
  ]

}

interface JobDetailData {
  imgSource: string,
  companyName: string,
  jobTitle: string
}
