import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../services/api.service";
import {Spinner} from "../components/spinner/spinner";
import {PollDisplayComponent} from "../components/poll-display/poll-display.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-leo-poll',
  templateUrl: './leo-poll.component.html',
  imports: [
    PollDisplayComponent,
    NgForOf
  ],
  styleUrl: './leo-poll.component.css'
})
export class LeoPollComponent implements OnInit {
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
