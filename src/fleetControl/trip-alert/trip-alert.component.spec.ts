import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAlertComponent } from './trip-alert.component';

describe('TripAlertComponent', () => {
  let component: TripAlertComponent;
  let fixture: ComponentFixture<TripAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
