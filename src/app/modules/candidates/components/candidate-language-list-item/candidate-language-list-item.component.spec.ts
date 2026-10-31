import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidateLanguageListItemComponent } from "./candidate-language-list-item.component";

describe("CandidateLanguageListItemComponent", () => {
  let component: CandidateLanguageListItemComponent;
  let fixture: ComponentFixture<CandidateLanguageListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateLanguageListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateLanguageListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
