import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidatesComponent } from './dashboard-candidates.component';

describe('DashboardCandidatesComponent', () => {
  let component: DashboardCandidatesComponent;
  let fixture: ComponentFixture<DashboardCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
