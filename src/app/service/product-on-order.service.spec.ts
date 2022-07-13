import { TestBed } from '@angular/core/testing';

import { ProductOnOrderService } from './product-on-order.service';

describe('ProductOnOrderService', () => {
  let service: ProductOnOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOnOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
