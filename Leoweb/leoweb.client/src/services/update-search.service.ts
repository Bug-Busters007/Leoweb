import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {FilterBarComponent} from "../app/components/filter-bar/filter-bar.component";

@Injectable({
  providedIn: 'root'
})
export class UpdateSearchService {

  //the data array holds all active filters
  private dataSource = new BehaviorSubject<string[]>([]);
  private filters: string[] = [];

  currentData = this.dataSource.asObservable();

  updateData() {
    this.dataSource.next(this.filters);
  }

  addOneFilter(filter: string): void {
    if (this.filters.indexOf(filter) === -1) {
      this.filters.push(filter);
    }
    this.updateData();
  }

  getFilters(): string[] {
    return this.filters;
  }

  setFilters(filters: string[]) {
    this.filters = filters;
    this.updateData();
  }
}
