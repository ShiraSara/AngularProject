import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCtrlMobileSenderComponent } from './fleet-ctrl-mobile-sender.component';

describe('FleetCtrlMobileSenderComponent', () => {
  let component: FleetCtrlMobileSenderComponent;
  let fixture: ComponentFixture<FleetCtrlMobileSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCtrlMobileSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCtrlMobileSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
