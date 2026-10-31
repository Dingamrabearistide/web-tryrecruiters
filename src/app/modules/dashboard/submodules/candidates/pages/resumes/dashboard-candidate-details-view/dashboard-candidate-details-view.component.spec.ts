import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidateDetailsViewComponent } from './dashboard-candidate-details-view.component';

describe('DashboardCandidateDetailsViewComponent', () => {
  let component: DashboardCandidateDetailsViewComponent;
  let fixture: ComponentFixture<DashboardCandidateDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidateDetailsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCandidateDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
