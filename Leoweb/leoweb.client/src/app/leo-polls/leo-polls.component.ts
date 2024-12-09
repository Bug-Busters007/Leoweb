import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-leo-polls',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './leo-polls.component.html',
  styleUrls: ['./leo-polls.component.css']
})
export class LeoPollsComponent implements OnInit {
  polls: any[] = [];
  selectedAnswers: { [key: number]: string } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    this.http.get<any[]>('/assets/polls.json').subscribe(
      data => (this.polls = data),
      error => console.error('Error loading polls:', error)
    );
  }

  submitAnswer(pollId: number, answer: string): void {
    this.selectedAnswers[pollId] = answer;
  }
}
