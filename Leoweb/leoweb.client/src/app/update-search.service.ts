import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UpdateSearchService {
  private dataSource = new BehaviorSubject<string[]>([]);

  currentData = this.dataSource.asObservable();

  updateData(data: string[]) {
    this.dataSource.next(data);
  }
}
