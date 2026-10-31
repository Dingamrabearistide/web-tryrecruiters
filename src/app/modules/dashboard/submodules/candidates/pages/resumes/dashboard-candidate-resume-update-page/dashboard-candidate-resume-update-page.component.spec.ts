import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidateResumeUpdatePageComponent } from './dashboard-candidate-resume-update-page.component';

describe('DashboardCandidateResumeUpdatePageComponent', () => {
  let component: DashboardCandidateResumeUpdatePageComponent;
  let fixture: ComponentFixture<DashboardCandidateResumeUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidateResumeUpdatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCandidateResumeUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
