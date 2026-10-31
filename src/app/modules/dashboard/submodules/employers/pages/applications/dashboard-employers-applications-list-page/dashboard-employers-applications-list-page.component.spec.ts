import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployersApplicationsListPageComponent } from './dashboard-employers-applications-list-page.component';

describe('DashboardEmployersApplicationsListPageComponent', () => {
  let component: DashboardEmployersApplicationsListPageComponent;
  let fixture: ComponentFixture<DashboardEmployersApplicationsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployersApplicationsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEmployersApplicationsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
