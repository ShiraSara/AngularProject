import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdotComponent } from './odot.component';

describe('OdotComponent', () => {
  let component: OdotComponent;
  let fixture: ComponentFixture<OdotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
