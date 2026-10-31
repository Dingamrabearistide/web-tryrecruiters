import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployerJobOffersListPageComponent } from './dashboard-employer-job-offers-list-page.component';

describe('DashboardEmployerJobOffersListPageComponent', () => {
  let component: DashboardEmployerJobOffersListPageComponent;
  let fixture: ComponentFixture<DashboardEmployerJobOffersListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployerJobOffersListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEmployerJobOffersListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
