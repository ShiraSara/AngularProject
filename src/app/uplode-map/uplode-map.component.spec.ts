import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UplodeMapComponent } from './uplode-map.component';

describe('UplodeMapComponent', () => {
  let component: UplodeMapComponent;
  let fixture: ComponentFixture<UplodeMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UplodeMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UplodeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
