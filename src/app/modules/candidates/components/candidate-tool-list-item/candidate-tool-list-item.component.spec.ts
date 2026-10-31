import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidateToolListItemComponent } from "./candidate-tool-list-item.component";

describe("CandidateToolListItemComponent", () => {
  let component: CandidateToolListItemComponent;
  let fixture: ComponentFixture<CandidateToolListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateToolListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateToolListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
