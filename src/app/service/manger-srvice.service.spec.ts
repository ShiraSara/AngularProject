import { TestBed } from '@angular/core/testing';

import { MangerSrviceService } from './manger-srvice.service';

describe('MangerSrviceService', () => {
  let service: MangerSrviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangerSrviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
