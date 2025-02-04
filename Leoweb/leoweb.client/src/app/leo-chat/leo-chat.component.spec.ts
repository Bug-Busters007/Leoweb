import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeoChatComponent } from './leo-chat.component';

describe('LeoChatComponent', () => {
  let component: LeoChatComponent;
  let fixture: ComponentFixture<LeoChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeoChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
