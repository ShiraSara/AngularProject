import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangarComponent } from './mangar.component';

describe('MangarComponent', () => {
  let component: MangarComponent;
  let fixture: ComponentFixture<MangarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MangarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
