import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardEmployersCompaniesUpdatePageComponent } from "./dashboard-employers-companies-update-page.component";

describe("DashboardEmployersCompaniesUpdatePageComponent", () => {
  let component: DashboardEmployersCompaniesUpdatePageComponent;
  let fixture: ComponentFixture<DashboardEmployersCompaniesUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployersCompaniesUpdatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEmployersCompaniesUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
