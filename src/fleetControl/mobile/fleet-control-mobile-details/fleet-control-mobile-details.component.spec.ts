import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetControlMobileDetailsComponent } from './fleet-control-mobile-details.component';

describe('FleetControlMobileDetaileComponent', () => {
  let component: FleetControlMobileDetailsComponent;
  let fixture: ComponentFixture<FleetControlMobileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetControlMobileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetControlMobileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
