import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidatesPersonalInfoComponent } from "./candidates-personal-info.component";

describe("CandidatesPersonalInfoComponent", () => {
  let component: CandidatesPersonalInfoComponent;
  let fixture: ComponentFixture<CandidatesPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatesPersonalInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
