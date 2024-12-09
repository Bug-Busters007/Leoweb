import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeoPollsComponent } from './leo-polls.component';

describe('LeoPollsComponent', () => {
  let component: LeoPollsComponent;
  let fixture: ComponentFixture<LeoPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeoPollsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeoPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
