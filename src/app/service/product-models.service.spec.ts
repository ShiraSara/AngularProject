import { TestBed } from '@angular/core/testing';

import { ProductModelsService } from './product-models.service';

describe('ProductModelsService', () => {
  let service: ProductModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
