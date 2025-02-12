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
    console.log(this.data);
    this.dataSource.next(this.data);
  }

  addFilter(filter: string): void {
    this.updateData([...this.data, filter]);
    FilterBarComponent.addFilterInDoc(filter);
  }

  getFilters(): string[] {
    return this.data;
  }

  setFilters(filters: string[]) {
    this.data = filters;
  }
}
