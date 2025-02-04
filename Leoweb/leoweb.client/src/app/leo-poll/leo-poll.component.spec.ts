import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeoPollComponent } from './leo-poll.component';

describe('LeoPollComponent', () => {
  let component: LeoPollComponent;
  let fixture: ComponentFixture<LeoPollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeoPollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeoPollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
