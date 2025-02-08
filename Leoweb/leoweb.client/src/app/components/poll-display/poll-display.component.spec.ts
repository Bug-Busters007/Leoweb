import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollDisplayComponent } from './poll-display.component';

describe('PollDisplayComponent', () => {
  let component: PollDisplayComponent;
  let fixture: ComponentFixture<PollDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PollDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
