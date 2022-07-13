import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SighOutComponent } from './sigh-out.component';

describe('SighOutComponent', () => {
  let component: SighOutComponent;
  let fixture: ComponentFixture<SighOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SighOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SighOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
