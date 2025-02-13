import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {FilterBarComponent} from "../app/components/filter-bar/filter-bar.component";

@Injectable({
  providedIn: 'root'
})
export class UpdateSearchService {
  private dataSource = new BehaviorSubject<string[]>([]);
  private data: string[] = [];

  currentData = this.dataSource.asObservable();

  updateData(data: string[]) {
    this.data = [...data];
    this.dataSource.next(this.data);
  }

  addOneFilter(filter: string): void {
    if (this.data.indexOf(filter) === -1) {
      this.data.push(filter);
    }
  }

  getFilters(): string[] {
    return this.data;
  }

  setFilters(filters: string[]) {
    this.data = filters;
  }
}
