import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../services/api.service";
import {Spinner} from "../components/spinner/spinner";
import {PollDisplayComponent} from "../components/poll-display/poll-display.component";
import {NgForOf, NgIf} from "@angular/common";
import { PollOverview } from '../../models/pollOverviewModel';
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {PollCreaterComponent} from "../components/poll-creater/poll-creater.component";
import {provideNativeDateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-leo-poll',
  templateUrl: './leo-poll.component.html',
  imports: [
    PollDisplayComponent,
    NgForOf,
    MatButton,
    NgIf,
    PollCreaterComponent,
  ],
  providers: provideNativeDateAdapter(),
  styleUrl: './leo-poll.component.css'
})
export class LeoPollComponent implements OnInit {
  pollArr: Array<PollOverview> = [];
  isCreaterVisible = false;

  constructor(private http: HttpClient, private apiService: ApiService, private router: Router) {}

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
        .get<PollOverview[]>(url)
        .toPromise();
      if (response) {
        this.pollArr = response;
      }
    } catch (error) {
      console.error('Error getting all polls', error);
      throw new Error('Failed to get all polls');
    }
  }

  showPollCreater(): void{
    this.isCreaterVisible = !this.isCreaterVisible;
  }
}
