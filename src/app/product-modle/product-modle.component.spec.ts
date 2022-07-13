import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModleComponent } from './product-modle.component';

describe('ProductModleComponent', () => {
  let component: ProductModleComponent;
  let fixture: ComponentFixture<ProductModleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
