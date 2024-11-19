import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeoLibraryComponent } from './leo-library.component';

describe('LeoLibraryComponent', () => {
  let component: LeoLibraryComponent;
  let fixture: ComponentFixture<LeoLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeoLibraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeoLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
