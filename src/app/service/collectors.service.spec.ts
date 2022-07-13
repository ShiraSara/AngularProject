import { TestBed } from '@angular/core/testing';

import { CollectorsService } from './collectors.service';

describe('CollectorsService', () => {
  let service: CollectorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
