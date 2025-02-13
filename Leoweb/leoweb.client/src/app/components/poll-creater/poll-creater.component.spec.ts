import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollCreaterComponent } from './poll-creater.component';

describe('PollCreaterComponent', () => {
  let component: PollCreaterComponent;
  let fixture: ComponentFixture<PollCreaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PollCreaterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollCreaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
