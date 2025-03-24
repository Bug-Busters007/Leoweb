import {Component, OnInit} from '@angular/core';
import {EventData} from "@angular/cdk/testing";
import {EventScraperService, LeoEvent} from "../../../services/event-scraper.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-scraper-test',
  standalone: true,
  templateUrl: './scraper-test.component.html',
  imports: [
    NgForOf
  ],
  styleUrl: './scraper-test.component.css'
})
export class ScraperTestComponent implements OnInit{
  events: LeoEvent[] = [];

  constructor(private scraperService: EventScraperService) {}
  ngOnInit() {
    this.scraperService.getEvents().subscribe(events => {
      this.events = events;
    });
  }
}
