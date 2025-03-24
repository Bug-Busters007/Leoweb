import { TestBed } from '@angular/core/testing';

import { EventScraperService } from './event-scraper.service';

describe('EventScraperService', () => {
  let service: EventScraperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventScraperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
