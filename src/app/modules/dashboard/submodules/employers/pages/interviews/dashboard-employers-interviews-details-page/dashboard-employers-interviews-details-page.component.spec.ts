import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployersInterviewsDetailsPageComponent } from './dashboard-employers-interviews-details-page.component';

describe('DashboardEmployersInterviewsDetailsPageComponent', () => {
  let component: DashboardEmployersInterviewsDetailsPageComponent;
  let fixture: ComponentFixture<DashboardEmployersInterviewsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployersInterviewsDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEmployersInterviewsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
