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
import {AuthService} from "../../services/auth.service";
import {PollService} from "../../services/poll.service";

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
  pollArr: Array<PollOverview> | null = [];
  isCreaterVisible = false;
  isAdmin: boolean = false;
  role: string = "";
  private refreshSub: Subscription|null = null;

  constructor(private authService: AuthService, private http: HttpClient, private apiService: ApiService, private router: Router, private refreshService: RefreshService, private pollService: PollService) {}

  async ngOnInit() {
    const pdiv = document.getElementById('pollsDiv');
    const spinner = new Spinner(pdiv);
    spinner.showSpinner();
    this.pollArr = await this.pollService.getAllPolls();
    spinner.removeSpinner();
    this.refreshSub = this.refreshService.refresh$.subscribe(async() =>{
      this.pollArr = await this.pollService.getAllPolls();
    });
    this.authService.getUserData().subscribe((data) => {
      this.role = data.role;
      this.isAdmin = this.role === "admin";
      console.log(`User is admin: ${this.isAdmin}`);
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  showPollCreater(): void{
    this.isCreaterVisible = !this.isCreaterVisible;
  }
}
