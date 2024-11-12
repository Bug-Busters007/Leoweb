import { Injectable } from '@angular/core';
import {environment} from "../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl : string= environment.apiUrl;
  constructor() {}

  async getData() : Promise<string>{
    const response = await fetch(this.apiUrl + 'testCall');
    return await response.json();
  }
}
