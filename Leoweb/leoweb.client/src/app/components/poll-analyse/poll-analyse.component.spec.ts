import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAnalyseComponent } from './poll-analyse.component';

describe('PollAnalyseComponent', () => {
  let component: PollAnalyseComponent;
  let fixture: ComponentFixture<PollAnalyseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PollAnalyseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
