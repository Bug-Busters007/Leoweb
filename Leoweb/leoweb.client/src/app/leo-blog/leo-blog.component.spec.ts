import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeoBlogComponent } from './leo-blog.component';

describe('LeoBlogComponent', () => {
  let component: LeoBlogComponent;
  let fixture: ComponentFixture<LeoBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeoBlogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LeoBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

