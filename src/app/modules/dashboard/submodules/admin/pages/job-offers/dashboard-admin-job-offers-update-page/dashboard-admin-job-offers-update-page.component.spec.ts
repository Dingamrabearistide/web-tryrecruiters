import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardEmployerJobOffersUpdatePageComponent } from "./dashboard-employer-job-offers-update-page.component";

describe("DashboardEmployerJobOffersUpdatePageComponent", () => {
  let component: DashboardEmployerJobOffersUpdatePageComponent;
  let fixture: ComponentFixture<DashboardEmployerJobOffersUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployerJobOffersUpdatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEmployerJobOffersUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
