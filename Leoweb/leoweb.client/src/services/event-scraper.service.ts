import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiService} from "./api.service";

export interface LeoEvent {
  date: string;
  time: string;
  event: string;
  location: string;
}
@Injectable({
  providedIn: 'root'
})
export class EventScraperService {
  constructor(private http: HttpClient, private apiService : ApiService) {}

  getEvents(): Observable<LeoEvent[]> {
    const url = this.apiService.getApiUrl('scraper/events');
    return this.http.get<LeoEvent[]>(url);
  }
}
