import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidatesLanguagesListComponent } from "./candidates-languages-list.component";

describe("CandidatesLanguagesListComponent", () => {
  let component: CandidatesLanguagesListComponent;
  let fixture: ComponentFixture<CandidatesLanguagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatesLanguagesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesLanguagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
