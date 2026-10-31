import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidatesInterviewsListPageComponent } from './dashboard-candidates-interviews-list-page.component';

describe('DashboardCandidatesInterviewsListPageComponent', () => {
  let component: DashboardCandidatesInterviewsListPageComponent;
  let fixture: ComponentFixture<DashboardCandidatesInterviewsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidatesInterviewsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCandidatesInterviewsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
