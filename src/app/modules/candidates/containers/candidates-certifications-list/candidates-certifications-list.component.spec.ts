import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidatesCertificationsListComponent } from "./candidates-certifications-list.component";

describe("CandidatesCertificationsListComponent", () => {
  let component: CandidatesCertificationsListComponent;
  let fixture: ComponentFixture<CandidatesCertificationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatesCertificationsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesCertificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
