import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardAdminUsersUpdatePageComponent } from "./dashboard-admin-users-update-page.component";

describe("DashboardAdminUsersUpdatePageComponent", () => {
  let component: DashboardAdminUsersUpdatePageComponent;
  let fixture: ComponentFixture<DashboardAdminUsersUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardAdminUsersUpdatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdminUsersUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
