import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCtrlMobileTableComponent } from './fleet-ctrl-mobile-table.component';

describe('FleetCtrlMobileComponent', () => {
  let component: FleetCtrlMobileTableComponent;
  let fixture: ComponentFixture<FleetCtrlMobileTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCtrlMobileTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCtrlMobileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
