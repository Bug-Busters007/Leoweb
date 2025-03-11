import { Injectable } from '@angular/core';
import {environment} from "../environments/environments";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserData} from "../app/user-data-model";
interface LoginResponse {
  token: string;
  expiresAt: string;
  username: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  register(email: string, password: string, role: string): Observable<string> {
    const registerRequest: RegisterRequest = { email, password, role };
    console.log(registerRequest.role);
    return this.http.post<string>(`${this.apiUrl}/auth/register`, registerRequest);
  }

  getUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/getUserData`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {});
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/auth/changePassword`, { email, oldPassword, newPassword});
  }

  changeEmail(oldEmail: string, newEmail: string, password: string): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/auth/changeEmail`, { oldEmail, newEmail, password });
  }
}
