import { Injectable } from '@angular/core';
import {UpdateSearchService} from "./update-search.service";

@Injectable({
  providedIn: 'root'
})
export class ActiveFilterService {

  private activeFilters: string[];
  constructor() {
    this.activeFilters = [];
  }

  public getActiveFilters(): string[] {
    return this.activeFilters;
  }

  public addFilter(filter: string): void {
    this.activeFilters.push(filter);
  }
}
