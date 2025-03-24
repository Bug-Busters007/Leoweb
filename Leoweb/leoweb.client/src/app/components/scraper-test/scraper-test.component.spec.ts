import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScraperTestComponent } from './scraper-test.component';

describe('ScraperTestComponent', () => {
  let component: ScraperTestComponent;
  let fixture: ComponentFixture<ScraperTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScraperTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScraperTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
