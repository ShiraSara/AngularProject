import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetControlTableComponent } from './fleet-control-table.component';

describe('FleetControlTableComponent', () => {
  let component: FleetControlTableComponent;
  let fixture: ComponentFixture<FleetControlTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetControlTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetControlTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
