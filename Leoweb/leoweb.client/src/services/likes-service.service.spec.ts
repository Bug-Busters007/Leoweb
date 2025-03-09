import { TestBed } from '@angular/core/testing';

import { LikesServiceService } from './likes-service.service';

describe('LikesServiceService', () => {
  let service: LikesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
