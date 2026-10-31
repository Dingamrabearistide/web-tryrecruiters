import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployersSubscriptionsListPageComponent } from './dashboard-employers-subscriptions-list-page.component';

describe('DashboardEmployersSubscriptionsListPageComponent', () => {
  let component: DashboardEmployersSubscriptionsListPageComponent;
  let fixture: ComponentFixture<DashboardEmployersSubscriptionsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployersSubscriptionsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEmployersSubscriptionsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
