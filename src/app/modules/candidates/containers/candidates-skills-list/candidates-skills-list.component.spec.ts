import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidatesSkillsListComponent } from "./candidates-skills-list.component";

describe("CandidatesSkillsListComponent", () => {
  let component: CandidatesSkillsListComponent;
  let fixture: ComponentFixture<CandidatesSkillsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatesSkillsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesSkillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
