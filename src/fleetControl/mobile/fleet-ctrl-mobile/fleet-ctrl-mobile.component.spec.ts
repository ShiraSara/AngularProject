import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCtrlMobileComponent } from './fleet-ctrl-mobile.component';

describe('FleetCtrlMobileComponent', () => {
  let component: FleetCtrlMobileComponent;
  let fixture: ComponentFixture<FleetCtrlMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCtrlMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCtrlMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
