import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminApplicationsListPageComponent } from './dashboard-admin-applications-list-page.component';

describe('DashboardEmployersApplicationsListPageComponent', () => {
  let component: DashboardAdminApplicationsListPageComponent;
  let fixture: ComponentFixture<DashboardAdminApplicationsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminApplicationsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAdminApplicationsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
