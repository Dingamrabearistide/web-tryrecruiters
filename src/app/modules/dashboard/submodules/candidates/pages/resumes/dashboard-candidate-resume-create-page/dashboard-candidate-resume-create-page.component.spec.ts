import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidateResumeCreatePageComponent } from './dashboard-candidate-resume-create-page.component';

describe('DashboardCandidateResumeCreatePageComponent', () => {
  let component: DashboardCandidateResumeCreatePageComponent;
  let fixture: ComponentFixture<DashboardCandidateResumeCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidateResumeCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCandidateResumeCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
