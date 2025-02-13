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

  addOneFilter(filter: string): void {
    this.data.push(filter);
  }

  getFilters(): string[] {
    return this.data;
  }

  setFilters(filters: string[]) {
    this.data = filters;
  }
}
