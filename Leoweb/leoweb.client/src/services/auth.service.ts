import { Injectable } from '@angular/core';
import {environment} from "../environments/environments";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserData} from "../app/user-data-model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(email: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/register`, { email, password });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {});
  }

  getUserData(): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/auth/userdata`);
  }

}
