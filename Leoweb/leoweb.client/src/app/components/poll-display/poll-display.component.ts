import { CommonModule, NgForOf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {Component, Input, NgModule} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { PollOverview } from '../../../models/pollOverviewModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll-display',
  standalone: true,

  templateUrl: './poll-display.component.html',
  styleUrl: './poll-display.component.css',

  imports: [
    NgForOf,
    FormsModule
  ],
})
export class PollDisplayComponent {
  @Input() poll!: PollOverview;
  headline: string = "";
  description: string = "";
  choices: string[] = [];
  selectedChoice: string | null = null;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  ngOnInit(): void {
    if (this.poll) {
      console.log(this.poll);
      this.headline = this.poll.headline;
      this.description = this.poll.description;
      this.choices = Array.from(Object.keys(this.poll.votes));
    }
  }

  async vote(): Promise<void> {
    console.log(this.selectedChoice);
    const url = this.apiService.getApiUrl('Poll/vote');
    try {
      const response = await this.http
        .post(url, {
          pollId: this.poll.id,
          choice: this.selectedChoice
        })
        .toPromise();
    } catch (error) {
      throw new Error("cannot vote");
    }
  }
}
