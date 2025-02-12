import { TestBed } from '@angular/core/testing';

import { ActiveFilterService } from './activeFilter.service';

describe('FilterService', () => {
  let service: ActiveFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveFilterService );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
