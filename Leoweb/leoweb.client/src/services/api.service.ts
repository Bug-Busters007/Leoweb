import { Injectable } from '@angular/core';
import {environment} from "../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl : string= environment.apiUrl;
  getApiUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }
}
