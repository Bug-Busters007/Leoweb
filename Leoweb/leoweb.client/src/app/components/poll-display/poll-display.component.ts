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
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {AdminOptionsComponent} from "../admin-options/admin-options.component";
import {PollAnalyseComponent} from "../poll-analyse/poll-analyse.component";

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
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    AdminOptionsComponent,
    NgIf,
    PollAnalyseComponent
  ],
})
export class PollDisplayComponent implements OnInit {
  @Input() id!: number;
  @Input() poll!: PollOverview;
  @Input() isAdmin!: boolean;
  headline: string = "";
  description: string = "";
  choices: string[] = [];
  selectedChoice: string | null = null;
  isPollOwner: boolean = false;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  async ngOnInit(): Promise<void> {
    if (this.poll) {
      this.headline = this.poll.headline;
      this.description = this.poll.description;
      this.choices = Array.from(Object.keys(this.poll.votes));
      if(localStorage.getItem('userId') === this.poll.creator) {
        this.isPollOwner = true;
      }
    }
  }

  async vote(): Promise<void> {
    const selection = this.selectedChoice;
    this.selectedChoice = null;
    const url = this.apiService.getApiUrl('Poll/vote');
    try {
      const response = await this.http
        .post(url, {
          pollId: this.poll.id,
          choice: selection
        })
        .toPromise();
    } catch (error) {
      throw new Error("cannot vote");
    }
  }
}

