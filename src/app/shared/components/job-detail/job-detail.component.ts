import { Component, inject, OnInit } from '@angular/core';
import { JobDetailHeaderComponent } from './job-detail-header/job-detail-header.component';
import { AboutTheJobComponent } from './about-the-job/about-the-job.component';
import { AboutTheCompanyComponent } from './about-the-company/about-the-company.component';
import { CardComponent } from '../card/card.component';
import { VacancyCard } from '../../../core/interfaces/VacancyCard.interface';
import { EMPLEOS } from '../../utils/empleos';
import { JOB_DETAILS } from '../../utils/job-details.mock';
import { EmpleoService } from '../../../core/services/empleo.service';
import { OptionItem } from '../../../core/interfaces/option.interface';
import { ApplicationFormComponent } from '../application-form/application-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { PagerComponent } from "../pager/pager.component";

@Component({
  selector: 'app-job-detail',
  imports: [
    JobDetailHeaderComponent,
    AboutTheJobComponent,
    AboutTheCompanyComponent,
    CardComponent,
    ApplicationFormComponent,
    TranslateModule,
    PagerComponent
],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss',
})
export class JobDetailComponent implements OnInit {
  empleoService = inject(EmpleoService);
  
  jobs: VacancyCard[] = EMPLEOS.map((empleo: any, idx: number) => ({
    id: empleo.id ?? idx + 1,
    rol: empleo.cargo,
    logoCompany: '/assets/img/logo-microsoft.png',
    location: `${empleo.ubicacion?.ciudad ?? ''}, ${
      empleo.ubicacion?.provincia ?? ''
    }, ${empleo.ubicacion?.pais ?? ''}`,
    creationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
    nameCompany: empleo.empresa,
  }));
  pageSize = 5;
  visibleJobs: VacancyCard[] = this.jobs.slice(0, this.pageSize);
  selectedJob = this.jobs[0];
  selectedJobDetail: any = null;
  isApplicationModalOpen = false;
  currentPage = 0;

  ngOnInit() {
    this.loadJobDetail(this.selectedJob.id);
  }

  selectJob(job: VacancyCard) {
    this.selectedJob = job;
    this.loadJobDetail(job.id);
  }

  loadJobDetail(id: number) {
    this.selectedJobDetail = JOB_DETAILS[id] ?? null;
  }

  get hasDetail(): boolean {
    return !!this.selectedJobDetail;
  }

  onSearchResults(
    cargo: string,
    ubicacion: string,
    filtros: Record<string, OptionItem>
  ) {
    const empleosFiltrados = this.empleoService.buscarEmpleos(cargo, ubicacion, filtros);

    this.jobs = empleosFiltrados.map((empleo, idx) => ({
      id: empleo.id ?? idx + 1,
      rol: empleo.cargo,
      logoCompany: '/assets/img/logo-microsoft.png',
      location: `${empleo.ubicacion?.ciudad ?? ''}, ${empleo.ubicacion?.provincia ?? ''}, ${empleo.ubicacion?.pais ?? ''}`,
      creationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      nameCompany: empleo.empresa,
    }));

    this.currentPage = 0;
    this.updateVisibleJobs();
  }

  openApplicationFormModal() {
    this.isApplicationModalOpen = true;
  }

  closeApplicationFormModal() {
    this.isApplicationModalOpen = false;
  }

  updateVisibleJobs() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.visibleJobs = this.jobs.slice(startIndex, endIndex);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updateVisibleJobs();
  }
}
