import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RecentSearch } from '../../../core/interfaces/recent-search.interface';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recent-searches',
  imports: [TranslateModule],
  templateUrl: './recent-searches.component.html',
  styleUrl: './recent-searches.component.scss'
})
export class RecentSearchesComponent implements OnInit{
  //vaciar el array para que no se muestren los datos mockeados
  searches: RecentSearch[] = [{
    id:1,
    title: 'Full Stack Developer JR.'
  },{
    id:2,
    title: 'Java developer'
  },{
    id:3,
    title: 'Frontend Developer'
  },{
    id:4,
    title: 'Backend Developer'
  }];
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

// descomentar para usar correctamente, ahora esta mokeado para mostrarlo
  ngOnInit(): void{
    // if(this.isBrowser){
    //   const stored = localStorage.getItem('recentSearches');
    //   this.searches = stored ? JSON.parse(stored) : [];
    // }
  }

  showJob(jobId:number){
    //Agregar la funcion para redireccionar a la vacante y mostrarla.
    console.log(jobId);
  }
}
