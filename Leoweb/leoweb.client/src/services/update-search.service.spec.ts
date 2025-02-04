import { TestBed } from '@angular/core/testing';

import { UpdateSearchService } from './update-search.service';

describe('UpdateSearchService', () => {
  let service: UpdateSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
