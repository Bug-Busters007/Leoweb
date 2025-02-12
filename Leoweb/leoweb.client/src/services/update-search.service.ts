import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateSearchService {
  private dataSource = new BehaviorSubject<string[]>([]);
  private data: string[] = [];

  currentData = this.dataSource.asObservable();

  updateData(data: string[]) {
    this.data = [...data];
    console.log(data);
    this.dataSource.next(this.data);
  }

  addFilter(filter: string): void {
    this.updateData([...this.data, filter]);
  }
}
