import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {Subscription} from "rxjs";
import {RefreshService} from "../../services/refresh.service";

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
export class LeoPollComponent implements OnInit, OnDestroy {
  pollArr: Array<PollOverview> = [];
  isCreaterVisible = false;
  private refreshSub!: Subscription;

  constructor(private http: HttpClient, private apiService: ApiService, private router: Router, private refreshService: RefreshService) {}

  async ngOnInit() {
    const pdiv = document.getElementById('pollsDiv');
    const spinner = new Spinner(pdiv);
    spinner.showSpinner();
    await this.getAllPolls();
    spinner.removeSpinner();
    this.refreshSub = this.refreshService.refresh$.subscribe(async() =>{
      await this.getAllPolls();
    });
  }

  ngOnDestroy() {
    this.refreshSub.unsubscribe();
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
