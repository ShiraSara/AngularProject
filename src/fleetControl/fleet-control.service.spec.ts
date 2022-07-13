import { TestBed } from '@angular/core/testing';

import { FleetControlService } from './fleet-control.service';

describe('FleetControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleetControlService = TestBed.get(FleetControlService);
    expect(service).toBeTruthy();
  });
});
