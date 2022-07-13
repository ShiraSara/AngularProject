import { TestBed } from '@angular/core/testing';

import { UplodeService } from './uplode.service';

describe('UplodeService', () => {
  let service: UplodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UplodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
