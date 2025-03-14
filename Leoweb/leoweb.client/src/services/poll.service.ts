import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { PollName } from '../models/pollNameModel';
import {firstValueFrom, Observable} from 'rxjs';
import {environment} from "../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class PollService {
  apiUrl = environment.apiUrl;

  constructor(private apiService: ApiService, private http: HttpClient) { }

  async getPollNames(): Promise<PollName[]> {
    const url = this.apiService.getApiUrl(`Poll/user/pollNames`);
    const value: PollName[] = await firstValueFrom<PollName[]>(this.http.get<PollName[]>(url));
    console.log(value);
    return value;
  }


  deletePoll(id: number) : Observable<void> {
    console.log('sending request');
    return this.http.delete<void>(`${this.apiUrl}/Poll/${id}`);
  }
}
