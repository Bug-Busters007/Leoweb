import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { PollName } from '../models/pollNameModel';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  async getPollNames(): Promise<PollName[]> {
    let resp;
    const url = this.apiService.getApiUrl('Poll/user/pollNames');
    await this.http.get<PollName[]>(url).subscribe({
      next: (response) => {
        resp = response;
      },
      error: (err) => {
        console.error("Error getting poll names", err);
      },
    });
    return resp ?? [];
  }
}
