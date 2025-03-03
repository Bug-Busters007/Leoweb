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
    const url = this.apiService.getApiUrl(`Poll/user/pollNames`);
    const value: PollName[] = await firstValueFrom<PollName[]>(this.http.get<PollName[]>(url));
    console.log(value);
    return value;
  }
}
