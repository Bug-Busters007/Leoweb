import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environments";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {Spinner} from "../components/spinner/spinner";
import {FormsModule} from "@angular/forms";
import {PollDisplayComponent} from "../components/poll-display/poll-display.component";
import {FileDisplayComponent} from "../components/file-display/file-display.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-leo-poll',
  templateUrl: './leo-poll.component.html',
  imports: [
    PollDisplayComponent,
    FileDisplayComponent,
    NgForOf
  ],
  styleUrl: './leo-poll.component.css'
})
export class LeoPollComponent {
  pollArr: Array<any> = [];

  constructor(private http: HttpClient, private apiService: ApiService) {}

  async ngOnInit() {
    const pdiv = document.getElementById('pollsDiv');
    const spinner = new Spinner(pdiv);
    spinner.showSpinner();
    await this.getAllPolls();
    spinner.removeSpinner();
  }

  async getAllPolls(): Promise<void>{
    const url = this.apiService.getApiUrl('Poll/all');
    try {
      const response = await this.http
        .get(url)
        .toPromise();
      if (response) {
        this.pollArr = Object.values(response);
      }
    } catch (error) {
      console.error('Error getting all polls', error);
      throw new Error('Failed to get all polls');
    }
  }
}
