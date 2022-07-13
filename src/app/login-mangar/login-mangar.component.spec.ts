import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMangarComponent } from './login-mangar.component';

describe('LoginMangarComponent', () => {
  let component: LoginMangarComponent;
  let fixture: ComponentFixture<LoginMangarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginMangarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMangarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
