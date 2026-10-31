import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidatesToolsListComponent } from "./candidates-tools-list.component";

describe("CandidatesToolsListComponent", () => {
  let component: CandidatesToolsListComponent;
  let fixture: ComponentFixture<CandidatesToolsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatesToolsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesToolsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
