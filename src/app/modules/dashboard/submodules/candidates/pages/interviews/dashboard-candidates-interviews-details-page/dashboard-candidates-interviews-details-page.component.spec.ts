import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidatesInterviewsDetailsPageComponent } from './dashboard-candidates-interviews-details-page.component';

describe('DashboardCandidatesInterviewsDetailsPageComponent', () => {
  let component: DashboardCandidatesInterviewsDetailsPageComponent;
  let fixture: ComponentFixture<DashboardCandidatesInterviewsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidatesInterviewsDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCandidatesInterviewsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
