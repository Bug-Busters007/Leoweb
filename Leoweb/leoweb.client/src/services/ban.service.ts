import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {IStudentBan} from "../models/studentBanModel";
import {firstValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BanService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  async getAll(): Promise<IStudentBan[]> {
    const url = this.apiService.getApiUrl(`ban/allBans`);
    const value: IStudentBan[] = await firstValueFrom<IStudentBan[]>(this.http.get<IStudentBan[]>(url));
    return value;
  }

  banStudent(ban: IStudentBan): Observable<IStudentBan> {
    const url = this.apiService.getApiUrl(`ban/${ban.userId}`);
    return this.http.post<IStudentBan>(url, {BannedIn: ban.bannedIn, Reason: ban.reason});
  }

  delteBan(banId: string): Observable<void>{
    const url = this.apiService.getApiUrl(`ban/${banId}`);
    return this.http.delete<void>(url);
  }
}
