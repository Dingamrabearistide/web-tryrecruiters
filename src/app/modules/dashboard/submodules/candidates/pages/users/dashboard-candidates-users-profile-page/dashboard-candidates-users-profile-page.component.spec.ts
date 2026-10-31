import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidatesUsersProfilePageComponent } from './dashboard-candidates-users-profile-page.component';

describe('DashboardCandidatesUsersProfilePageComponent', () => {
  let component: DashboardCandidatesUsersProfilePageComponent;
  let fixture: ComponentFixture<DashboardCandidatesUsersProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidatesUsersProfilePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCandidatesUsersProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
