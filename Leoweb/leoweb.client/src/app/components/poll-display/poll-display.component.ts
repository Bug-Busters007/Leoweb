import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {Component, Input, NgModule, OnInit} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { PollOverview } from '../../../models/pollOverviewModel';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatButton} from "@angular/material/button";
import {AdminOptionsComponent} from "../admin/admin-options/admin-options.component";
import {PollAnalyseComponent} from "../poll-analyse/poll-analyse.component";
import { firstValueFrom } from 'rxjs';
import {RefreshService} from "../../../services/refresh.service";
import {PollResultComponent} from "../poll-result/poll-result.component";

@Component({
  selector: 'app-poll-display',
  standalone: true,

  templateUrl: './poll-display.component.html',
  styleUrl: './poll-display.component.css',

  imports: [
    NgForOf,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    MatRadioModule,
    MatButton,
    AdminOptionsComponent,
    NgIf,
    PollAnalyseComponent,
    PollResultComponent
  ],
})
export class PollDisplayComponent implements OnInit {
  @Input() poll!: PollOverview;
  @Input() isAdmin!: boolean;
  headline: string = "";
  description: string = "";
  choices: string[] = [];
  selectedChoice: string | null = null;
  isPollOwner: boolean = false;
  isPollClosed: [boolean, boolean] = [false, false];
  voteCount: number = 0;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  async ngOnInit(): Promise<void> {
    if (this.poll) {
      this.isPollClosed = this.isClosed();
      this.headline = this.poll.headline;
      this.description = this.poll.description;
      this.choices = Array.from(Object.keys(this.poll.votes));
      if(localStorage.getItem('userId') === this.poll.creator) {
        this.isPollOwner = true;
      }
      new Map<string, number>(Object.entries(this.poll.votes)).forEach((count: number, _: string) => this.voteCount = this.voteCount + count);
    }
    const url = this.apiService.getApiUrl(`Poll/${this.poll.id}/vote`);
    try {
      const response = await firstValueFrom(this.http.get<{choice: string} | null>(url));
      this.selectedChoice = response?.choice ?? null;
    } catch (error) {
      console.error('Fehler beim Abrufen der Auswahl:', error);
      this.selectedChoice = null;
    }
  }

  async vote(): Promise<void> {
    const url = this.apiService.getApiUrl('Poll/vote');
    try {
      const response = await firstValueFrom(this.http
        .put(url, {
          pollId: this.poll.id,
          choice: this.selectedChoice
        }));
    } catch (error) {
      throw new Error("cannot vote");
    }
  }

  // returns [isClosed, showResults]
  isClosed(): [boolean, boolean]{
    const currentDate: Date = new Date();
    const closeDate: Date = new Date(this.poll.close);
    const releaseDate: Date = new Date(this.poll.release);
    if(currentDate < closeDate && currentDate > releaseDate) {
      return [false, false];
    }else if(currentDate > closeDate){
      return [true, true];
    }
    return [true, false];
  }
}
