import { TestBed } from '@angular/core/testing';

import { GrafhService } from './grafh.service';

describe('GrafhService', () => {
  let service: GrafhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrafhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
