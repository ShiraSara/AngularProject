import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProductInOrderComponent } from './show-product-in-order.component';

describe('ShowProductInOrderComponent', () => {
  let component: ShowProductInOrderComponent;
  let fixture: ComponentFixture<ShowProductInOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowProductInOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProductInOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
