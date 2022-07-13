import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFleetCtrlComponent } from './main-fleet-ctrl.component';

describe('MainFleetCtrlComponent', () => {
  let component: MainFleetCtrlComponent;
  let fixture: ComponentFixture<MainFleetCtrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFleetCtrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFleetCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
