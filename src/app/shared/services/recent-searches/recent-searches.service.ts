import { Injectable } from '@angular/core';
import { RecentSearch } from '../../../core/interfaces/recent-search.interface';

@Injectable({
  providedIn: 'root'
})
export class RecentSearchesService {
  private readonly key = 'recentSearches';
  private readonly searchesLimit = 5;

  constructor() { }

  addSearch(search: RecentSearch){
    let record: RecentSearch[] = this.getSearch();
    record = record.filter((s => s.id !== search.id));

    record.unshift(search);

    record = record.slice(0, this.searchesLimit);

    localStorage.setItem(this.key, JSON.stringify(record));
  }

  getSearch(): RecentSearch[]{
    const raw = localStorage.getItem('recentSearches');
    return raw ? JSON.parse(raw) : [];
  }

  limpiarHistorial(): void {
    localStorage.removeItem(this.key);
  }
}
