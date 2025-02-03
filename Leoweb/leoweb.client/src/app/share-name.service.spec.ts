import { TestBed } from '@angular/core/testing';

import { ShareNameService } from './share-name.service';

describe('SharNameService', () => {
  let service: ShareNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
