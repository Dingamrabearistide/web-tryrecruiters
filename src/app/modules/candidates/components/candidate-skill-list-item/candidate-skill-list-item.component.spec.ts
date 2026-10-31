import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidateSkillListItemComponent } from "./candidate-skill-list-item.component";

describe("CandidateSkillListItemComponent", () => {
  let component: CandidateSkillListItemComponent;
  let fixture: ComponentFixture<CandidateSkillListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateSkillListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateSkillListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
