import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environments";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {Spinner} from "../components/spinner/spinner";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-leo-poll',
  templateUrl: './leo-poll.component.html',
  styleUrl: './leo-poll.component.css'
})
export class LeoPollComponent {

  constructor(private http: HttpClient, private apiService: ApiService) {}

  async ngOnInit() {
    await this.getAllPolls();
  }

  async getAllPolls(): Promise<void>{
    const pdiv = document.getElementById('pollsDiv');
    const spinner = new Spinner(pdiv);
    spinner.showSpinner();
    const url = this.apiService.getApiUrl('Poll/all');
    try {
      const response = await this.http
        .get(url)
        .toPromise();
      if (response) {
        spinner.removeSpinner();
        pdiv!.innerText = JSON.stringify(response);
      }
    } catch (error) {
      console.error('Error getting all polls', error);
      throw new Error('Failed to get all polls');
    }
  }
}
