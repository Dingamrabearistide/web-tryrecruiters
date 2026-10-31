import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardCandidatesApplicationsListPageComponent } from "./dashboard-candidates-applications-list-page.component";

describe("DashboardEmployersApplicationsListPageComponent", () => {
  let component: DashboardCandidatesApplicationsListPageComponent;
  let fixture: ComponentFixture<DashboardCandidatesApplicationsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCandidatesApplicationsListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DashboardCandidatesApplicationsListPageComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
